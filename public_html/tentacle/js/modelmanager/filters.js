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