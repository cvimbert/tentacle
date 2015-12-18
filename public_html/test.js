/* global Tentacle, modelDescriptorV3 */
$(document).ready(function () {
    var modelManager = new Tentacle.ModelManager();
    modelManager.init(modelDescriptorV3);
    
    var mod = modelManager.addModel("Variable");
    mod.set("variabletype", "number");
    mod.set("numbervalue", 45);
    
    var mod2 = modelManager.addModel("Variable");
    mod2.set("variabletype", "string");
    
    var mod3 = modelManager.addModel("Variable");
    mod3.set("variabletype", "number");
    mod3.set("numbervalue", 45);
    
    var mod4 = modelManager.addModel("Variable");
    mod4.set("variabletype", "boolean");
    
    var mod5 = modelManager.addModel("Variable");
    mod5.set("variabletype", "number");
    mod5.set("numbervalue", 33);
    
    //var filter = new Tentacle.Filter("variabletype", "string");
    
    var filtersSet = new Tentacle.FiltersSet(Tentacle.FilterOperand.OR);
    filtersSet.addFilter("variabletype", "number");
    filtersSet.addFilter("numbervalue", 45);
    
    var ls = modelManager.getModelByType("Variable", filtersSet);
    
    
    Tentacle.log(Tentacle.Exceptions.verywell, "");
});