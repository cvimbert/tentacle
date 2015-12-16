/* global Tentacle, _, uuid */

Tentacle.ModelDescriptor = function (modelManager) {

    var self = this;
    var descriptorsByClasses = {};


    this.load = function (jsonDescriptor) {

        _.each(jsonDescriptor, function (jsonClassDescriptor, classId) {
            var descriptor = new Tentacle.ClassModelDescriptor(classId, jsonClassDescriptor, self, modelManager);
            descriptorsByClasses[classId] = descriptor;
        });

    };


    this.getClassDescriptor = function (classId) {

        if (!descriptorsByClasses[classId]) {
            Tentacle.Logger.log(Tentacle.Exceptions.cantfinddescriptor, classId);
            return null;
        }

        return descriptorsByClasses[classId];
    };
};


Tentacle.ClassModelDescriptor = function (classId, jsonClassDescriptor, modelDescriptor, modelManager) {
    
    var self = this;
    
    
    this.getRaw = function () {
        return jsonClassDescriptor;
    };

    this.getAttributes = function () {
        return jsonClassDescriptor.attributes;
    };

    this.getAttribute = function (id) {
        return getAttributes()[id];
    };

    this.getClone = function () {
        var serializedDescriptor = JSON.stringify(jsonClassDescriptor);
        return JSON.parse(serializedDescriptor);
    };
    
    
    this.getObjectBySource = function (sourceObject) {
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
    
    this.getObject = function (descriptorAttributes, sourceObject, destObject) {
        _.each(descriptorAttributes, function (attribute, attributeId) {
            if (!sourceObject || !sourceObject.attributes[attributeId]) {
                
                if (!destObject.attributes) {
                    destObject.attributes = {};
                }
                
                switch (attribute.type) {
                    
                    case Tentacle.BaseObjectTypes.STRING:
                        destObject.attributes[attributeId] = "";
                        break;

                    case Tentacle.BaseObjectTypes.NUMBER:
                        if (attribute.defaultvalue) {
                            destObject.attributes[attributeId] = attribute.defaultvalue;
                        } else {
                            destObject.attributes[attributeId] = 0;
                        }
                        break;

                    case Tentacle.BaseObjectTypes.BOOLEAN:
                        if (attribute.defaultvalue) {
                            destObject.attributes[attributeId] = attribute.defaultvalue;
                        } else {
                            destObject.attributes[attributeId] = "false";
                        }
                        break;

                    case Tentacle.ModelDecriptorTypes.CONDITIONAL_ATTRIBUTES_SET:
                        destObject.attributes[attributeId] = "";
                        break;

                    case Tentacle.ModelDecriptorTypes.COLLECTION:
                        destObject.attributes[attributeId] = [];
                        break;

                    default:
                        destObject.attributes[attributeId] = "";
                }
            } else {
                if (attribute.type === Tentacle.ModelDecriptorTypes.CONDITIONAL_ATTRIBUTES_SET) {
                    destObject.attributes[attributeId] = sourceObject.attributes[attributeId];
                    self.getObject(attribute.attributesSets[sourceObject.attributes[attributeId]], sourceObject, destObject);
                } else {
                    destObject.attributes[attributeId] = sourceObject.attributes[attributeId];
                }
            }
        });
    };
    
    
    // descriptor flatten functions
    
    this.flattenByItem = function (item) {
        var destDesc = {};
        self.flattenByDescItem(item, jsonClassDescriptor, destDesc, 0);
        return destDesc;
    };

    this.flattenByDescItem = function (item, desc, destDesc, indentation) {
        flattenByItemAction(item, desc.attributes, destDesc, indentation);
    };

    this.flattenAttribute = function (item, attribute, attributeId, destDesc, indentation) {

        if (attribute.type !== Tentacle.ModelDecriptorTypes.LINKED_CONDITIONAL_ATTRIBUTES_SET && attribute.type !== Tentacle.ModelDecriptorTypes.INCLUDE) {
            destDesc[attributeId] = attribute;
            destDesc[attributeId].indentation = indentation;
        }


        if (attribute.type === Tentacle.ModelDecriptorTypes.CONDITIONAL_ATTRIBUTES_SET) {

            if (item && item.attributes[attributeId]) {
                var selectedBranch = attribute.attributesSets[item[attributeId]];
                flattenByItemAction(item, selectedBranch, destDesc, indentation + 1);
            }

        } else if (attribute.type === Tentacle.ModelDecriptorTypes.INCLUDE) {

            var targetDescriptor = modelDescriptor.getClassDescriptor(attribute.includetype).getRaw();
            self.flattenAttribute(item, targetDescriptor, attributeId, destDesc, indentation);

        } else if (attribute.type === Tentacle.ModelDecriptorTypes.LINKED_CONDITIONAL_ATTRIBUTES_SET) {

            if (attribute.linktype === Tentacle.ModelDecriptorTypes.REFERENCE_ATTRIBUTE_VALUE) {
                var refItemId = item.attributes[attribute.linkedreference];

                if (refItemId) {

                    // recupération de l'objet qui possède cet id
                    var targetItem = modelManager.getItem(refItemId);

                    // récupération de la propriété qui nous intéresse dans cet objet
                    var targetItemSelectedValue = targetItem.attributes[attribute.linkedattribute];

                    // choix de la branche fonction de cette propriété
                    var selectedBranch = attribute.attributesSets[targetItemSelectedValue];

                    // et flatten de la branche
                    flattenByItemAction(item, selectedBranch, destDesc, indentation);
                }
            }

            // non utilisé
            if (attribute.linktype === "attributevaluenonull") {

                if (item[attribute.link]) {

                    var selectedBranch = attribute.attribute;
                    flattenByItemAction(item, selectedBranch, destDesc, indentation);
                }
            }

        }
    };

    function flattenByItemAction(item, attributes, destDesc, indentation) {

        _.each(attributes, function (attribute, attributeId) {
            self.flattenAttribute(item, attribute, attributeId, destDesc, indentation);
        });
    }
};