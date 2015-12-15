/* global Tentacle, modelDescriptorV3 */
$(document).ready(function () {
    var modelManager = new Tentacle.ModelManager();
    modelManager.init(modelDescriptorV3);
    
    var sp = modelManager.getClassDescriptor("Sprite");
    var obj = sp.getObjectBySource(null);
    Tentacle.log(Tentacle.Exceptions.verywell, "");
});

    


