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
       $scope.foregroundSprites = Tentacle.modelManager.getModelByType("ForegroundSprite");
       $scope.backgroundSprites = Tentacle.modelManager.getModelByType("BackgroundSprite");
    };

    $scope.getModels = function () {
        $scope.models = Tentacle.modelManager.getModelByType($scope.modeltype);
    };

    $scope.addReferenceItem = shared.addReferenceItem;

    $scope.editItem = shared.editItem;

    $scope.editItemByItem = shared.editItemByItem;

    $scope.getName = shared.getName;
    
    $scope.getSpriteUrl = function (model) {
        return getImageUrl(model, "sprites");
    };
    
    $scope.getControlUrl = function (model) {
        return getImageUrl(model, "controls");
    };
    
    $scope.getImageUrl = function (model, folder) {
        var spriteFile = Tentacle.modelManager.getModelByUid(model.get("reference"));
        var spritePackage = Tentacle.modelManager.getModelByUid(spriteFile.get("package"));
        return spritePackage.get("identifier") + "/" + folder + "/" + spriteFile.get("file");
    }

    $scope.deleteItem = function (descid, item, $event) {
        $event.stopPropagation();
        Tentacle.modelManager.deleteItem(descid, item);
    };
});
