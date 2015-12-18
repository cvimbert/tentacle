/* global Tentacle, modelDescriptorV3 */
$(document).ready(function () {
    var modelManager = new Tentacle.ModelManager();
    modelManager.init(modelDescriptorV3);
    
    var mod = new Tentacle.Model();
    mod.create("Sprite", modelManager);
    mod.set("variabletype", "number");
    
    var str = JSON.stringify(mod);
    var mod2 = new Tentacle.Model(JSON.parse(str));
    
    Tentacle.log(Tentacle.Exceptions.verywell, "");
});