/* global Tentacle, modelDescriptorV3 */

$(document).ready(function () {
    var modelManager = new Tentacle.ModelManager();
    var modelDescriptor = new Tentacle.ModelDescriptor();
    modelDescriptor.load(modelDescriptorV3);
    modelDescriptor.getClassDescriptor("Sprite");
});

