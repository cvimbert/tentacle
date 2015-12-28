/* global angular, Tentacle, modelDescriptorV3, monitorDesc, _ */

var mainApp = angular.module("monitoring-panel", ['ngRoute']);

var tmpl = $("<div></div>");

mainApp.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
                when('/', {
                    template: tmpl,
                    controller: 'panelscontroller'
                });
        /*.
         otherwise({
         redirectTo: '/'
         });*/
    }]);

mainApp.controller("panelscontroller", function ($scope) {

});

mainApp.controller("modelmonitorcontroller", function ($scope) {

    var modalOptions = {
        backdrop: "static",
        keyboard: false
    };

    var pendingItems = [];

    $scope.backItemsStack = [];

    $scope.getModels = function () {
        $scope.models = Tentacle.modelManager.getModelByType($scope.modeltype);
    };

    $scope.addReferenceItem = function (descid, addto, addin) {
        $scope.descid = descid;
        var itemDesc = Tentacle.modelManager.getClassDescriptor(descid);

        $scope.item = itemDesc.getObjectBySource(null);

        if (addto && addin && $scope.item.uid) {
            var pitem = {addto: addto, addin: addin, added: $scope.item.uid, type: "reference"};
            pendingItems[$scope.item.uid] = pitem;
        }

        $scope.descriptor = itemDesc.flattenByItem($scope.item);

        $scope.backItemsStack.push($scope.item);

        $("#modal-desc").modal(modalOptions);
    };

    $scope.editItem = function (uid) {
        var item = Tentacle.modelManager.getModelByUid(uid);
        $scope.editItemByItem(_.clone(item));
    };

    $scope.editItemByItem = function (item, isback) {
        // attention, ici pas de clone, donc pas de données temporaires d'item
        $scope.descid = item.type;
        $scope.item = item;
        $scope.descriptor = Tentacle.modelManager.getClassDescriptor(item.type).flattenByItem(item);

        if (!isback) {
            $scope.backItemsStack.push($scope.item);
        }

        $("#modal-desc").modal(modalOptions);
    };

    $scope.getName = function (item, defaultvalue) {
        if (item.get("name")) {
            return item.get("name");
        } else {
            if (defaultvalue !== undefined) {
                return defaultvalue;
            } else {
                return item.uid;
            }
        }
    };

    $scope.deleteItem = function (descid, item, $event) {
        $event.stopPropagation();
        Tentacle.modelManager.deleteItem(descid, item);
    };
});

$(document).ready(function () {
    var app = new Tentacle.MonitoringApp();
});

Tentacle.MonitoringApp = function () {

    //Tentacle.pendingItems = [];

    var modelManager = new Tentacle.ModelManager();
    modelManager.init(modelDescriptorV3);

    var sp1 = modelManager.addModel("Sprite");
    sp1.set("name", "sprite 1");
    var sp2 = modelManager.addModel("Sprite");
    sp2.set("name", "sprite 2");
    var var1 = modelManager.addModel("Variable");
    var1.set("name", "variable 1");

    // voir si il existe une manière plus judicieuse de rendre dispo le modelManager
    Tentacle.modelManager = modelManager;

    $.get("includes/layout.html", function (data) {
        tmpl = $(data);

        var panelsSet = new Tentacle.MonitorPanelsSet("panelsset1");

        angular.bootstrap(document, ["monitoring-panel"]);
    });
};

Tentacle.MonitorPanelsSet = function (panelId) {
    var panelDesc = monitorDesc[panelId];

    for (var uPanelId in panelDesc.panels) {
        var uPanelDesc = panelDesc.panels[uPanelId];

        var panel = new Tentacle.MonitorPanel(uPanelId, uPanelDesc);
        panel.create();
    }
};

Tentacle.MonitorPanel = function (id, panelDesc) {

    this.create = function () {
        var tp = _.template('<div id="<%= id %>" ng-init="name=\'<%= name %>\'; modeltype=\'<%= modeltype %>\'; getModels();" ng-controller="modelmonitorcontroller" ng-include="\'includes/basemonitor.html\'">Container1</div>');
        var html = tp({id: id, name: panelDesc.name, modeltype: panelDesc.type});

        $("#" + panelDesc.containerid, tmpl).append(html);
    };

};