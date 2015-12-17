/* global Tentacle, modelDescriptorV3 */
$(document).ready(function () {
    var modelManager = new Tentacle.ModelManager();
    modelManager.init(modelDescriptorV3);
    
    /*var sp = modelManager.getClassDescriptor("Variable");
    var obj = sp.getObjectBySource(null);
    obj.attributes.variabletype = "string";
    obj = sp.getObjectBySource(obj);*/
    
    var mod = new Tentacle.Model("Sprite", modelManager);
    mod.set("prop1", "yes");
    var s1 = mod.get("prop1");
    mod.get("test");
    
    var str = JSON.stringify(mod);
    
    Tentacle.log(Tentacle.Exceptions.verywell, "");
});