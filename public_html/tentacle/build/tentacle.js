var Tentacle = {};
/* global Tentacle */

Tentacle.BaseObjectTypes = {
    STRING: "string",
    BOOLEAN: "boolean",
    NUMBER: "number"
};
/* global Tentacle */

Tentacle.Exceptions = {
    cantfinddescriptor: "Can't find ClassDescriptor '$$' in descriptors",
    badloggerargs: "Bad logger arguments",
    verywell: "Everything is fine !",
    cantFindModelProperty: "Can't find property '$$' in model of type '$$'"
};
/* global Tentacle */

Tentacle.FilterOperand = {
    AND: "and",
    OR: "or"
};

Tentacle.FiltersSet = function (operand) {
    
    this.operand = operand;
    this.filters = [];
    
    this.addFilter = function (propertyName, propertyValue) {
        this.filters.push(new Tentacle.Filter(propertyName, propertyValue));
    };
};

Tentacle.Filter = function (propertyName, propertyValue) {
    this.propertyName = propertyName;
    this.propertyValue = propertyValue;
};
/* global Tentacle, _ */

Tentacle.LoggerLevels = {
    LOG: "log",
    WARNING: "warning",
    ERROR: "error"
};

Tentacle.Logger = new function() {
    
    this.sendLog = function (msg, args, level) {
        
        if (!level) {
            level = Tentacle.LoggerLevels.WARNING;
        }
        
        var argsToken = "$$";
        
        if ((typeof args) === "object") {
            
            _.each(args, function (arg) {
                var index = msg.indexOf(argsToken, 1);
                msg = msg.slice(0, index) + arg + msg.slice(index + argsToken.length, msg.length);
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
    
    this.log = function (msg, args) {
        Tentacle.Logger.sendLog(msg, args, Tentacle.LoggerLevels.LOG);
    };
    
    this.warn = function (msg, args) {
        Tentacle.Logger.sendLog(msg, args, Tentacle.LoggerLevels.WARNING);
    };
    
    this.error = function (msg, args) {
        Tentacle.Logger.sendLog(msg, args, Tentacle.LoggerLevels.ERROR);
    };
    
    // aliases
    Tentacle.log = this.log;
    Tentacle.warn = this.warn;
    Tentacle.error = this.error;
}();
/* global Tentacle, uuid, _ */

Tentacle.Model = function (jsonModel) {

    var self = this;
    var modelManager;

    this.attributes = {};
    this.trashCan = {};
    
    
    if (jsonModel) {
        for (var id in jsonModel) {
            this[id] = jsonModel[id];
        }
    }

    this.init = function () {
        this.mutate();
    };
    
    this.create = function (type, modManager) {
        this.type = type;
        this.uid = uuid.v4();
        
        modelManager = modManager;
        
        this.init();
    };

    this.set = function (property, value) {
        this.attributes[property] = value;
        
        // on ne devrait le faire que dans le cas des attributs conditionnels
        this.mutate();
    };

    this.get = function (property) {

        if (!this.attributes[property]) {
            //Tentacle.log(Tentacle.Exceptions.cantFindModelProperty, [property, this.type]);
            return null;
        }

        return this.attributes[property];
    };


    this.mutate = function () {
        var modelDescriptor = modelManager.getClassDescriptor(this.type);

        // le destObject est créé pour éviter de garder dans le modèle des propriétés qui ne seraient plus utilisées
        // stockage des anciennes valeurs dans une corbeille

        _.each(this.attributes, function (attribute, attributeId) {
            self.trashCan[attributeId] = attribute;
        });

        var newAttributes = {};

        var flattenDescriptor = modelDescriptor.flattenByItem(this);
        getObject(flattenDescriptor, newAttributes);

        this.attributes = newAttributes;
    };


    function getObject(descriptorAttributes, newAttributes) {

        _.each(descriptorAttributes, function (attribute, attributeId) {

            // source object ne sera jamais null
            if (!self.attributes[attributeId]) {

                switch (attribute.type) {

                    case Tentacle.BaseObjectTypes.STRING:
                        newAttributes[attributeId] = "";
                        break;

                    case Tentacle.BaseObjectTypes.NUMBER:
                        if (attribute.defaultvalue) {
                            newAttributes[attributeId] = attribute.defaultvalue;
                        } else {
                            newAttributes[attributeId] = 0;
                        }
                        break;

                    case Tentacle.BaseObjectTypes.BOOLEAN:
                        if (attribute.defaultvalue) {
                            newAttributes[attributeId] = attribute.defaultvalue;
                        } else {
                            newAttributes[attributeId] = "false";
                        }
                        break;

                    case Tentacle.ModelDecriptorTypes.CONDITIONAL_ATTRIBUTES_SET:
                        newAttributes[attributeId] = "";
                        break;

                    case Tentacle.ModelDecriptorTypes.COLLECTION:
                        newAttributes[attributeId] = [];
                        break;

                    default:
                        newAttributes[attributeId] = "";
                }
            } else {

                if (attribute.type === Tentacle.ModelDecriptorTypes.CONDITIONAL_ATTRIBUTES_SET) {

                    newAttributes[attributeId] = self.attributes[attributeId];
                    getObject(attribute.attributesSets[self.attributes[attributeId]], newAttributes);

                } else {

                    newAttributes[attributeId] = self.attributes[attributeId];

                }
            }
        });
    }

    this.clearTrashCan = function () {
        this.trashCan = {};
    };

    this.clone = function () {
        var str = JSON.stringify(this);
        return JSON.parse(str);
    };
};
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
/* global Tentacle */

Tentacle.ModelDecriptorTypes = {
    CONDITIONAL_ATTRIBUTES_SET: "ConditionalAttributesSet",
    COLLECTION: "collection",
    LINKED_CONDITIONAL_ATTRIBUTES_SET: "LinkedConditionalAttributesSet",
    INCLUDE: "include",
    REFERENCE_ATTRIBUTE_VALUE: "referenceattributevalue"
};
/* global Tentacle, _ */

Tentacle.ModelManager = function () {

    var models = {};
    var modelsByType = {};

    var modelDescriptor;

    var self = this;


    this.init = function (jsonModelDescriptor) {
        modelDescriptor = new Tentacle.ModelDescriptor(this);
        modelDescriptor.load(jsonModelDescriptor);
        //self.loadDefaultModel();
    };

    this.addModel = function (type, register) {
        var model = new Tentacle.Model();
        model.create(type, this);

        if (register !== false)
            this.registerModel(model);

        return model;
    };

    this.registerModel = function (model) {

        models[model.uid] = model;

        if (!modelsByType[model.type]) {
            modelsByType[model.type] = {};
        }

        modelsByType[model.type][model.uid] = model;
    };

    this.loadModel = function (id) {

        if (localStorage["model-" + id]) {
            items = JSON.parse(localStorage["model-" + id]);

            _.each(items, function (item) {
                if (!modelsByType[item.type]) {
                    modelsByType[item.type] = {};
                }

                modelsByType[item.type][item.uid] = item;
            });

            localStorage["defaultModel"] = id;
        }
    };

    this.getDescriptors = function () {
        return modelDescriptor.getDescriptors();
    };

    this.getClassDescriptor = function (id) {
        return modelDescriptor.getClassDescriptor(id);
    };

    this.saveObject = function (objectType, object) {
        if (!modelsByType[objectType]) {
            modelsByType[objectType] = {};
        }

        modelsByType[objectType][object.uid] = object;
        models[object.uid] = object;
    };

    this.loadDefaultModel = function () {
        if (localStorage["defaultModel"]) {
            self.loadModel(localStorage["defaultModel"]);
        } else {
            self.loadModel("base");
        }
    };

    this.saveDefaultModel = function () {
        if (localStorage["defaultModel"]) {
            self.saveToStorage(localStorage["defaultModel"]);
        } else {
            self.saveToStorage("base");
        }
    };

    this.saveToStorage = function (id) {
        if (!id) {
            localStorage["model"] = JSON.stringify(items);
        } else {
            localStorage["model-" + id] = JSON.stringify(items);
        }

        localStorage["defaultModel"] = id;
    };

    this.deleteLocalStorage = function (id) {
        if (!id) {
            delete localStorage["model"];
        } else {
            delete localStorage["model-" + id];
        }

    };

    this.getModel = function () {
        return modelsByType;
    };
    
    this.getModelByUid = function (uid) {
        return models[uid];
    };

    this.getModelByType = function (type, filter) {

        if (!filter) {
            return modelsByType[type];
        } else {

            var filtered = {};

            for (var id in modelsByType[type]) {

                var model = modelsByType[type][id];

                if (filter instanceof Tentacle.Filter) {

                    if (model.get(filter.propertyName)) {

                        if (model.get(filter.propertyName) === filter.propertyValue) {
                            filtered[id] = model;
                        }

                    } else {
                        // message d'erreur ou warning
                    }

                } else if (filter instanceof Tentacle.FiltersSet) {

                    // deux cas : ou / et
                    // on verifie si on doit choisir le modèle courant

                    var pushToList;
                    
                    if (filter.operand === Tentacle.FilterOperand.AND) {
                        pushToList = true;
                    } else if (filter.operand === Tentacle.FilterOperand.OR) {
                        pushToList = false;
                    }

                    for (var i = 0; i < filter.filters.length; i++) {

                        var currentFilter = filter.filters[i];

                        if (model.get(currentFilter.propertyName)) {

                            var equals = model.get(currentFilter.propertyName) === currentFilter.propertyValue;

                            if (filter.operand === Tentacle.FilterOperand.AND) {
                                
                                if (!equals) {
                                    pushToList = false;
                                    break;
                                }

                            } else if (filter.operand === Tentacle.FilterOperand.OR) {
                                
                                if (equals) {
                                    pushToList = true;
                                    break;
                                }
                            }
                        }
                    }
                }

                if (pushToList) {
                    filtered[id] = model;
                }
            }

            return filtered;
        }
    };

    this.deleteItem = function (descid, item) {
        delete modelsByType[descid][item.uid];
        delete models[item.uid];
    };

    this.clearModel = function () {
        _.each(modelsByType, function (modelContent, modelType) {
            delete modelsByType[modelType];
        });

        models = {};
    };
};