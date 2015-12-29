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

    // TODO doit pouvoir être remplacé par autre chose
    $scope.$on("editItem", function (event, args) {
        $scope.item = args.item;

        $scope.descriptor = Tentacle.modelManager.getClassDescriptor($scope.item.type).flattenByItem($scope.item);
        $scope.descid = $scope.item.type;

        if (!args.pushInStack)
            $scope.backItemsStack.push($scope.item);

        if (args.pending)
            pendingItems[$scope.item.uid] = args.pending;

        $("#modal-desc").modal(modalOptions);
    });


    shared.editItem = function (uid) {
        var item = Tentacle.modelManager.getModelByUid(uid);
        $scope.editItemByItem(_.clone(item));
    };
    
    $scope.editItem = shared.editItem;

    shared.editItemByItem = function (item, isback) {

        // attention, ici pas de clone, donc pas de données temporaires d'item

        var args = {
            item: item,
            descriptor: Tentacle.modelManager.getClassDescriptor(item.type).flattenByItem(item),
            pushInStack: isback
        };

        $scope.$emit("editItem", args);
    };
    
    $scope.editItemByItem = shared.editItemByItem;


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


    $scope.attributeSetSelected = function () {
        $scope.item.mutate();

        if (pendingItems[$scope.item.uid]) {
            pendingItems[$scope.item.uid].added = $scope.item;
        }

        // on remplace l'objet courant dans la stack
        $scope.backItemsStack[$scope.backItemsStack.length - 1] = $scope.item;

        $scope.descriptor = Tentacle.modelManager.getClassDescriptor($scope.descid).flattenByItem($scope.item);
    };

    $scope.getReferences = function (targetDescid) {
        var mod = Tentacle.modelManager.getModelById(targetDescid);
        return mod;
    };

    $scope.validate = function () {
        validatePendingItem($scope.item.uid);
        Tentacle.modelManager.saveObject($scope.descid, $scope.item);
    };

    $scope.getReferencesCollection = function (item, attribute) {

        // ceci est peut-être à supprimer pour un truc plus souple

        if (attribute.referencetype === "linkedcollection") {

            var ret = {};

            if (item.get(attribute.linkedcollectionattribute)) {
                var linkedItemAttribute = item.get(attribute.linkedcollectionattribute);
                var litem = Tentacle.modelManager.getItem(linkedItemAttribute);

                var itemValues = litem.get(attribute.linkedcollectionattributevalue);

                _.each(itemValues, function (itemUid) {
                    var it = Tentacle.modelManager.getItem(itemUid);
                    ret[itemUid] = it;
                });
            }

            return ret;

        } else {
            //return $scope.completeModel[attribute.referencetype];
            return Tentacle.modelManager.getModelByType(attribute.referencetype);
        }

        return {};
    };

    $scope.goBack = function () {

        deletePendingItem($scope.item.uid);

        // attention, erreur là dedans
        if ($scope.backItemsStack.length > 1) {
            var it = $scope.backItemsStack.pop();
            $scope.editItemByItem($scope.backItemsStack[$scope.backItemsStack.length - 1], true);
        } else {
            $scope.closeEditionModal();
        }
    };

    function deletePendingItem(uid) {
        delete pendingItems[uid];
    }

    function validatePendingItem(uid) {

        if (pendingItems[uid]) {
            var pitem = pendingItems[uid];

            var toDesc = Tentacle.modelManager.getClassDescriptor(pitem.addto.type).getRaw();
            var toType = toDesc.attributes[pitem.addin].type;

            if (pitem.type === "reference") {
                if (toType === "collection") {
                    pitem.addto.attributes[pitem.addin].push($scope.item.uid);
                } else if (toType === "reference") {
                    pitem.addto.attributes[pitem.addin] = $scope.item.uid;
                }
            }

            if (pitem.type === "object") {
                if (toType === "collection") {
                    pitem.addto.attributes[pitem.addin].push(pitem.added);
                } else if (toType === "reference") {
                    pitem.addto.attributes[pitem.addin] = pitem.added;
                }
            }
        }
    }


    $scope.validateAndGoBack = function () {
        $scope.validate();
        $scope.goBack();
    };

    $scope.getNameByUid = function (uid) {
        var item = Tentacle.modelManager.getModelByUid(uid);
        return $scope.getName(item);
    };

    $scope.closeEditionModal = function () {
        $scope.backItemsStack = [];
        clearPendingItems();
        $("#modal-desc").modal("hide");
    };

    
    shared.addReferenceItem = function (descid, addto, addin) {
        var item = Tentacle.modelManager.addModel(descid, false);

        var pitem;
        if (addto && addin && $scope.item.uid) {
            pitem = {addto: addto, addin: addin, added: item.uid, type: "reference"};
        }

        var args = {
            item: item,
            descriptor: Tentacle.modelManager.getClassDescriptor(item.type).flattenByItem(item),
            pushInStack: false,
            pending: pitem
        };

        $scope.$emit("editItem", args);
    };
    
    $scope.addReferenceItem = shared.addReferenceItem;


    // utilisé deux fois, voir si on peut mutualiser
    shared.getName = function (item, defaultvalue) {
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
    
    $scope.getName = shared.getName;

});

mainApp.controller("modelmonitorcontroller", function ($scope, shared) {


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