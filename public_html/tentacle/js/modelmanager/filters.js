/* global Tentacle */

Tentacle.filterOperand = {
    AND: "and",
    OR: "or"
};

Tentacle.filtersSet = function (operand) {
    
    this.operand = operand;
    this.filters = [];
    
    this.addFilter = function (propertyName, propertyValue) {
        this.filters.push(new Tentacle.filter(propertyName, propertyValue));
    };
};

Tentacle.filter = function (propertyName, propertyValue) {
    this.propertyName = propertyName;
    this.propertyValue = propertyValue;
};