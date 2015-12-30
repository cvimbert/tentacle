/* global Tentacle */

Tentacle.mainApp.controller("modelmonitorcontroller", function ($scope, shared) {

    $scope.getModels = function () {
        $scope.models = Tentacle.modelManager.getModelByType($scope.modeltype);
    };

    $scope.addReferenceItem = shared.addReferenceItem;

    $scope.editItem = shared.editItem;

    $scope.editItemByItem = shared.editItemByItem;

    $scope.getName = shared.getName;

    $scope.deleteItem = function (descid, item, $event) {
        $event.stopPropagation();
        Tentacle.modelManager.deleteItem(descid, item);
    };
});