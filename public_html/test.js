/* global Tentacle, modelDescriptorV3 */
$(document).ready(function () {
    var modelManager = new Tentacle.ModelManager();
    var modelDescriptor = new Tentacle.ModelDescriptor(modelManager);
    
    modelDescriptor.load(modelDescriptorV3);
    var sp = modelDescriptor.getClassDescriptor("Sprite");
    var obj = sp.getObjectBySource(null);
    Tentacle.log(Tentacle.Exceptions.verywell, "");
});

    


