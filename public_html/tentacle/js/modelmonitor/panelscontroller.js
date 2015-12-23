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
    
    $scope.getModels = function () {
        $scope.models = Tentacle.modelManager.getModelByType($scope.modeltype);
    };
});

$(document).ready(function () {
    var app = new Tentacle.MonitoringApp();
});

Tentacle.MonitoringApp = function () {
    var modelManager = new Tentacle.ModelManager();
    modelManager.init(modelDescriptorV3);
    
    modelManager.addModel("Sprite");
    modelManager.addModel("Sprite");
    modelManager.addModel("Variable");
    
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
        var tp = _.template('<div id="<%= id %>" ng-init="name=\'<%= name %>\'; modeltype=\'<%= modeltype %>\';getModels();" ng-controller="modelmonitorcontroller" ng-include="\'includes/basemonitor.html\'">Container1</div>');
        var html = tp({id: id, name: panelDesc.name, modeltype: panelDesc.type});

        $("#" + panelDesc.containerid, tmpl).append(html);
    };

};