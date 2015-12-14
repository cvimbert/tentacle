Tentacle.BaseObjectTypes = {
    STRING: "string",
    BOOLEAN: "boolean",
    NUMBER: "number"
};

Tentacle.Exceptions = {
    cantfinddescriptor: "Can't find ClassDescriptor $$ in descriptors",
    badloggerargs: "Bad logger arguments",
    verywell: "Everything is fine !"
};

Tentacle.LoggerLevels = {
    LOG: "log",
    WARNING: "warning",
    ERROR: "error"
};

Tentacle.Logger = new function() {
    this.sendLog = function(msg, args, level) {
        if (!level) {
            level = Tentacle.LoggerLevels.WARNING;
        }
        var argsToken = "$$";
        if (typeof args === "array") {
            _.each(args, function(arg) {
                var index = msg.indexOf(argsToken, 1);
                msg = msg.slice(0, index - 1) + arg + msg.slice(index + argsToken.length, msg.length - 1);
            });
        } else if (typeof args === "string") {
            msg = msg.replace("$$", args);
        } else {
            console.log(Tentacle.Exceptions.badloggerargs);
            return;
        }
        switch (level) {
          case Tentacle.LoggerLevels.LOG:
            console.log(msg);
            break;

          case Tentacle.LoggerLevels.WARNING:
            console.warn(msg);
            break;

          case Tentacle.LoggerLevels.ERROR:
            console.error(msg);
            break;
        }
    };
    this.log = function(msg, args) {
        Tentacle.Logger.sendLog(msg, args, Tentacle.LoggerLevels.LOG);
    };
    this.warn = function(msg, args) {
        Tentacle.Logger.sendLog(msg, args, Tentacle.LoggerLevels.WARNING);
    };
    this.error = function(msg, args) {
        Tentacle.Logger.sendLog(msg, args, Tentacle.LoggerLevels.ERROR);
    };
    Tentacle.log = this.log;
    Tentacle.warn = this.warn;
    Tentacle.error = this.error;
}();

Tentacle.ModelDescriptor = function(modelManager) {
    var self = this;
    var descriptorsByClasses = {};
    this.load = function(jsonDescriptor) {
        _.each(jsonDescriptor, function(jsonClassDescriptor, classId) {
            var descriptor = new Tentacle.ClassModelDescriptor(classId, jsonClassDescriptor, self, modelManager);
            descriptorsByClasses[classId] = descriptor;
        });
    };
    this.getClassDescriptor = function(classId) {
        if (!descriptorsByClasses[classId]) {
            Tentacle.Logger.log(Tentacle.Exceptions.cantfinddescriptor, classId);
            return null;
        }
        return descriptorsByClasses[classId];
    };
};

Tentacle.ClassModelDescriptor = function(classId, jsonClassDescriptor, modelDescriptor, modelManager) {
    var self = this;
    this.getRaw = function() {
        return jsonClassDescriptor;
    };
    this.getAttributes = function() {
        return jsonClassDescriptor.attributes;
    };
    this.getAttribute = function(id) {
        return getAttributes()[id];
    };
    this.getClone = function() {
        var serializedDescriptor = JSON.stringify(jsonClassDescriptor);
        return JSON.parse(serializedDescriptor);
    };
    this.getObjectBySource = function(sourceObject) {
        var destObject = {};
        if (sourceObject && sourceObject.uid) {
            destObject.uid = sourceObject.uid;
        }
        if (sourceObject && sourceObject.type) {
            destObject.type = sourceObject.type;
        }
        var fdesc = self.flattenByItem(sourceObject);
        self.getObject(fdesc, sourceObject, destObject);
        if (!destObject.uid) {
            destObject.uid = uuid.v4();
        }
        if (!destObject.type) {
            destObject.type = classId;
        }
        return destObject;
    };
    this.getObject = function(descriptorAttributes, sourceObject, destObject) {
        _.each(descriptorAttributes, function(attribute, attributeId) {
            if (!sourceObject || !sourceObject[attributeId]) {
                switch (attribute.type) {
                  case Tentacle.BaseObjectTypes.STRING:
                    destObject[attributeId] = "";
                    break;

                  case Tentacle.BaseObjectTypes.NUMBER:
                    if (attribute.defaultvalue) {
                        destObject[attributeId] = attribute.defaultvalue;
                    } else {
                        destObject[attributeId] = 0;
                    }
                    break;

                  case Tentacle.BaseObjectTypes.BOOLEAN:
                    if (attribute.defaultvalue) {
                        destObject[attributeId] = attribute.defaultvalue;
                    } else {
                        destObject[attributeId] = "false";
                    }
                    break;

                  case Tentacle.ModelDecriptorTypes.CONDITIONAL_ATTRIBUTES_SET:
                    destObject[attributeId] = "";
                    break;

                  case Tentacle.ModelDecriptorTypes.COLLECTION:
                    destObject[attributeId] = [];
                    break;

                  default:
                    destObject[attributeId] = "";
                }
            } else {
                if (attribute.type === Tentacle.ModelDecriptorTypes.CONDITIONAL_ATTRIBUTES_SET) {
                    destObject[attributeId] = sourceObject[attributeId];
                    self.getObject(attribute.attributesSets[sourceObject[attributeId]], sourceObject, destObject);
                } else {
                    destObject[attributeId] = sourceObject[attributeId];
                }
            }
        });
    };
    this.flattenByItem = function(item) {
        var destDesc = {};
        self.flattenByDescItem(item, jsonClassDescriptor, destDesc, 0);
        return destDesc;
    };
    this.flattenByDescItem = function(item, desc, destDesc, indentation) {
        flattenByItemAction(item, desc.attributes, destDesc, indentation);
    };
    this.flattenAttribute = function(item, attribute, attributeId, destDesc, indentation) {
        if (attribute.type !== Tentacle.ModelDecriptorTypes.LINKED_CONDITIONAL_ATTRIBUTES_SET && attribute.type !== Tentacle.ModelDecriptorTypes.INCLUDE) {
            destDesc[attributeId] = attribute;
            destDesc[attributeId].indentation = indentation;
        }
        if (attribute.type === Tentacle.ModelDecriptorTypes.CONDITIONAL_ATTRIBUTES_SET) {
            if (item && item[attributeId]) {
                var selectedBranch = attribute.attributesSets[item[attributeId]];
                flattenByItemAction(item, selectedBranch, destDesc, indentation + 1);
            }
        } else if (attribute.type === Tentacle.ModelDecriptorTypes.INCLUDE) {
            var targetDescriptor = modelDescriptor.getClassDescriptor(attribute.includetype).getRaw();
            self.flattenAttribute(item, targetDescriptor, attributeId, destDesc, indentation);
        } else if (attribute.type === Tentacle.ModelDecriptorTypes.LINKED_CONDITIONAL_ATTRIBUTES_SET) {
            if (attribute.linktype === Tentacle.ModelDecriptorTypes.REFERENCE_ATTRIBUTE_VALUE) {
                var refItemId = item[attribute.linkedreference];
                if (refItemId) {
                    var targetItem = modelManager.getItem(refItemId);
                    var targetItemSelectedValue = targetItem[attribute.linkedattribute];
                    var selectedBranch = attribute.attributesSets[targetItemSelectedValue];
                    flattenByItemAction(item, selectedBranch, destDesc, indentation);
                }
            }
            if (attribute.linktype === "attributevaluenonull") {
                if (item[attribute.link]) {
                    var selectedBranch = attribute.attribute;
                    flattenByItemAction(item, selectedBranch, destDesc, indentation);
                }
            }
        }
    };
    function flattenByItemAction(item, attributes, destDesc, indentation) {
        _.each(attributes, function(attribute, attributeId) {
            self.flattenAttribute(item, attribute, attributeId, destDesc, indentation);
        });
    }
};

Tentacle.ModelDecriptorTypes = {
    CONDITIONAL_ATTRIBUTES_SET: "ConditionalAttributesSet",
    COLLECTION: "collection",
    LINKED_CONDITIONAL_ATTRIBUTES_SET: "LinkedConditionalAttributesSet",
    INCLUDE: "include",
    REFERENCE_ATTRIBUTE_VALUE: "referenceattributevalue"
};

Tentacle.ModelManager = function() {};

var Tentacle = {};