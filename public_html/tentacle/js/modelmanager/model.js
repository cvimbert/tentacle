/* global Tentacle */

Tentacle.Model = function (jsonModel) {
    
    this.uid = "";
    this.type = "";
    
    this.set = function (property, value) {
        jsonModel.attributes[property] = value;
    };
    
    this.get = function (property) {
        return jsonModel.attributes[property];
    };
};