/* global Tentacle, _ */

Tentacle.ModelManager = function () {
    
    var models = {};
    var modelsByType = {};
    
    var modelDescriptor;
    
    var self = this;
    
    
    this.init = function (jsonModelDescriptor) {
        modelDescriptor = new Tentacle.ModelDescriptor(this);
        modelDescriptor.load(jsonModelDescriptor);
        self.loadDefaultModel();
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

    this.getModelByType = function (type, filter) {
        
        if (!filter) {
            return modelsByType[type];
        } else {
            
            var filtered = {};
            
            for (var id in modelsByType[type]) {
                var model = modelsByType[type][id];
                
                if ((typeof filter) === "filter") {
                    
                    if (model[filter.propertyName]) {
                        
                        if (model[filter.propertyName] === filter.propertyValue) {
                            filtered[id] = model;
                        }
                        
                    } else {
                        // message d'erreur ou warning
                    }
                }
                
                // le cas de filtres à opérandes sera traité plus tard
                /*if (filter.operand === Tentacle.filterOperand.OR) {
                    
                    
                }*/
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