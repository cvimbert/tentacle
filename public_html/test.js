/* global Tentacle, modelDescriptorV3 */
$(document).ready(function () {
    var modelManager = new Tentacle.ModelManager();
    modelManager.init(modelDescriptorV3);
    
    var sp = modelManager.getClassDescriptor("Variable");
    var obj = sp.getObjectBySource(null);
    obj.attributes.variabletype = "string";
    obj = sp.getObjectBySource(obj);
    Tentacle.log(Tentacle.Exceptions.verywell, "");
});