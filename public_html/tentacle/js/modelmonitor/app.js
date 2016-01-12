/* global angular, Tentacle, modelDescriptorV3, monitorDesc, _, Localization */

Tentacle.mainApp = angular.module("monitoring-panel", ['ngRoute']);

Tentacle.mainApp.factory('shared', function () {
    return {
    };
});

Tentacle.mainApp.directive('draggable', function(){
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.draggable({
                cursor: "move",
                stop: function (event, ui) {
                    
                    // mettre un selected model à la place
                    scope.model.set("x", ui.position.left);
                    scope.model.set("y", ui.position.top);
                }
            });
        }
    };
});

$(document).ready(function () {
    var app = new Tentacle.MonitoringApp();
});

Tentacle.MonitoringApp = function () {

    var panelsSets = {};

    var modelManager = new Tentacle.ModelManager();
    modelManager.init(modelDescriptorV3);

    /*var sp1 = modelManager.addModel("Sprite");
    sp1.set("name", "sprite 1");
    var sp2 = modelManager.addModel("Sprite");
    sp2.set("name", "sprite 2");
    var var1 = modelManager.addModel("Variable");
    var1.set("name", "variable 1");*/
    //var1.set("variabletype", "boolean");

    // voir si il existe une manière plus judicieuse de rendre dispo le modelManager
    Tentacle.modelManager = modelManager;

    // chargement des templates
    var loadingManager = new Tentacle.LoadingManager();

    for (var setId in monitorDesc.sets) {
        loadingManager.addFile(monitorDesc.sets[setId].template);
    }

    loadingManager.load(function (datas) {
        defaultSetId = monitorDesc.defaultset;

        for (var setId in monitorDesc.sets) {
            var panelsSet = new Tentacle.MonitorPanelsSet(setId, monitorDesc.sets[setId], datas[monitorDesc.sets[setId].template]);
            panelsSet.init();
            panelsSets[setId] = panelsSet;
        }

        // initialisation du router
        Tentacle.mainApp.config(['$routeProvider',
            function ($routeProvider) {

                for (var setId in panelsSets) {
                    $routeProvider.when("/" + setId, {
                        template: panelsSets[setId].template,
                        controller: 'panelcontroller'
                    });
                }

                $routeProvider.otherwise({
                    redirectTo: '/' + defaultSetId
                });
            }]);

        Tentacle.modelManager.loadModel("base");

        angular.bootstrap(document, ["monitoring-panel"]);
    });
};