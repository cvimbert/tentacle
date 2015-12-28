/* global angular, Tentacle, modelDescriptorV3, monitorDesc, _, Localization */

var mainApp = angular.module("monitoring-panel", ['ngRoute']);

mainApp.factory('shared', function () {
    return {};
});

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

mainApp.controller("panelscontroller", function ($scope, shared) {

    var defaultLanguage = "fr";
    $scope.backItemsStack = [];

    var pendingItems = [];

    var modalOptions = {
        backdrop: "static",
        keyboard: false
    };

    /*$scope.$on("openDescModal", function (event, args) {
     $("#modal-desc").modal(modalOptions);
     
     $scope.descid = args.descid;
     $scope.descriptor = args.descriptor;
     $scope.item = args.model;
     });*/


    $scope.$on("editItem", function (event, args) {
        $scope.item = args.item;

        $scope.descriptor = Tentacle.modelManager.getClassDescriptor($scope.item.type).flattenByItem($scope.item);
        $scope.descid = $scope.item.type;

        if (args.pushInStack)
            $scope.backItemsStack.push($scope.item);
        
        if (args.pending)
            pendingItems[$scope.item.uid] = args.pending;

        $("#modal-desc").modal(modalOptions);
    });


    $scope.closeEditionModal = function () {
        $scope.backItemsStack = [];
        clearPendingItems();
        $("#modal-desc").modal("hide");
    };

    function clearPendingItems() {
        pendingItems = {};
    }

    $scope.getLocString = function (id) {
        if (!id) {
            return "";
        }

        if (Localization[defaultLanguage][id.toLowerCase()]) {
            return Localization[defaultLanguage][id.toLowerCase()];
        } else {
            return "!!" + id + "!!";
        }
    };

    /*$scope.$watch('', function (value) {

    });*/

    $scope.attributeSetSelected = function () {
        $scope.item.mutate();

        if (pendingItems[$scope.item.uid]) {
            pendingItems[$scope.item.uid].added = $scope.item;
        }

        // on remplace l'objet courant dans la stack
        $scope.backItemsStack[$scope.backItemsStack.length - 1] = $scope.item;

        $scope.descriptor = Tentacle.modelManager.getClassDescriptor($scope.descid).flattenByItem($scope.item);
    };
    
    // en double
    $scope.addReferenceItem = function (descid, addto, addin) {
        var item = Tentacle.modelManager.addModel(descid, false);

        var pitem;
        if (addto && addin && $scope.item.uid) {
            pitem = {addto: addto, addin: addin, added: item.uid, type: "reference"};
        }

        var args = {
            item: item,
            descriptor: Tentacle.modelManager.getClassDescriptor(item.type).flattenByItem(item),
            pushInStack: true,
            pending: pitem
        };

        $scope.$emit("editItem", args);
    };
    
    
    // utilisé deux fois, voir si on peut mutualiser
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

});

mainApp.controller("modelmonitorcontroller", function ($scope, shared) {


    $scope.getModels = function () {
        $scope.models = Tentacle.modelManager.getModelByType($scope.modeltype);
    };


    // en double
    $scope.addReferenceItem = function (descid, addto, addin) {
        var item = Tentacle.modelManager.addModel(descid, false);

        var pitem;
        if (addto && addin && $scope.item.uid) {
            pitem = {addto: addto, addin: addin, added: item.uid, type: "reference"};
        }

        var args = {
            item: item,
            descriptor: Tentacle.modelManager.getClassDescriptor(item.type).flattenByItem(item),
            pushInStack: true,
            pending: pitem
        };

        $scope.$emit("editItem", args);
    };

    $scope.editItem = function (uid) {
        var item = Tentacle.modelManager.getModelByUid(uid);
        $scope.editItemByItem(_.clone(item), true);
    };

    $scope.editItemByItem = function (item, isback) {
        
        // attention, ici pas de clone, donc pas de données temporaires d'item

        var args = {
            item: item,
            descriptor: Tentacle.modelManager.getClassDescriptor(item.type).flattenByItem(item),
            pushInStack: isback
        };

        $scope.$emit("editItem", args);
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

    var modelManager = new Tentacle.ModelManager();
    modelManager.init(modelDescriptorV3);

    var sp1 = modelManager.addModel("Sprite");
    sp1.set("name", "sprite 1");
    var sp2 = modelManager.addModel("Sprite");
    sp2.set("name", "sprite 2");
    var var1 = modelManager.addModel("Variable");
    var1.set("name", "variable 1");
    //var1.set("variabletype", "boolean");

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