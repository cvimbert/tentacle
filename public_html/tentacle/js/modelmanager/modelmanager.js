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

    this.addModel = function (type, register, presets) {
        var model = new Tentacle.Model();
        model.create(type, this, presets);

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