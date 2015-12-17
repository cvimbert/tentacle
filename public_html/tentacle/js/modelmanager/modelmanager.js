/* global Tentacle, _ */

Tentacle.ModelManager = function () {
    
    var itemsByDescid = {};
    var items = {};
    
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
                if (!itemsByDescid[item.type]) {
                    itemsByDescid[item.type] = {};
                }

                itemsByDescid[item.type][item.uid] = item;
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
        if (!itemsByDescid[objectType]) {
            itemsByDescid[objectType] = {};
        }

        itemsByDescid[objectType][object.uid] = object;
        items[object.uid] = object;
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
        return itemsByDescid;
    };

    this.getModelById = function (descid) {
        return itemsByDescid[descid];
    };

    this.deleteItem = function (descid, item) {
        delete itemsByDescid[descid][item.uid];
        delete items[item.uid];
    };

    this.clearModel = function () {
        _.each(itemsByDescid, function (modelContent, modelType) {
            delete itemsByDescid[modelType];
        });

        items = {};
    };

    this.getItem = function (uid) {
        return items[uid];
    };
};