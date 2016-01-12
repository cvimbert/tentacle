/* global Tentacle */

Tentacle.mainApp.controller("spritespanelcontroller", function ($scope, shared) {
    $scope.init = function (datas) {
       var serDatas = atob(datas);
       datasObj = JSON.parse(serDatas);
       
       for (var propName in datasObj) {
           $scope[propName] = datasObj[propName];
       }
       
       $scope.getModels();
       
       $scope.controlSprites = Tentacle.modelManager.getModelByType("ControlSprite");
    };

    $scope.getModels = function () {
        $scope.models = Tentacle.modelManager.getModelByType($scope.modeltype);
    };

    $scope.addReferenceItem = shared.addReferenceItem;

    $scope.editItem = shared.editItem;

    $scope.editItemByItem = shared.editItemByItem;

    $scope.getName = shared.getName;
    
    $scope.getSpriteUrl = function (model) {
        var spriteFile = Tentacle.modelManager.getModelByUid(model.get("reference"));
        var spritePackage = Tentacle.modelManager.getModelByUid(spriteFile.get("package"));
        return spritePackage.get("identifier") + "/sprites/" + spriteFile.get("file");
    };
    
    $scope.getControlUrl = function (model) {
        var spriteFile = Tentacle.modelManager.getModelByUid(model.get("reference"));
        var spritePackage = Tentacle.modelManager.getModelByUid(spriteFile.get("package"));
        return spritePackage.get("identifier") + "/controls/" + spriteFile.get("file");
    };

    $scope.deleteItem = function (descid, item, $event) {
        $event.stopPropagation();
        Tentacle.modelManager.deleteItem(descid, item);
    };
});
