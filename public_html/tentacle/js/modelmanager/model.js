/* global Tentacle */

Tentacle.Model = function (type, modelManager) {
    
    this.uid = uuid.v4();
    this.type = type;
    
    this.attributes = {};
    
    this.set = function (property, value) {
        this.attributes[property] = value;
        this.mutate();
    };
    
    this.get = function (property) {
        
        if (!this.attributes[property]) {
            Tentacle.error(Tentacle.Exceptions.cantFindModelProperty, [property, this.type]);
            return null;
        }
        
        return this.attributes[property];
    };
    
    this.mutate = function () {
        
    };
    
    this.clone = function () {
        var str = JSON.stringify(this);
        return JSON.parse(str);
    };
};