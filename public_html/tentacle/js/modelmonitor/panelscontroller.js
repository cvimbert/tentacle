/* global angular, Tentacle */

var mainApp = angular.module("monitoring-panel", ['ngRoute']);

var tmpl = $("<div></div>");

mainApp.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
                when('/', {
                    template: tmpl,
                    controller: 'panelscontroller'
                }).
                otherwise({
                    redirectTo: '/'
                });
    }]);

mainApp.controller("panelscontroller", function ($scope) {

});

mainApp.controller("modelmonitorcontroller", function ($scope) {

});

$(document).ready(function () {

    $.get("includes/layout.html", function (data) {
        tmpl = $(data);
        
        var panel1 = new Tentacle.MonitorPanel("p1", "Panel 1", "centera1");
        panel1.create();
        var panel2 = new Tentacle.MonitorPanel("p2", "Panel 2", "centera2");
        panel2.create();

        angular.bootstrap(document, ["monitoring-panel"]);
    });


});

Tentacle.MonitorPanel = function (id, name, containerId) {

    this.create = function () {
        var html = '<div id="' + id + '" ng-init="name=\'' + name + '\'" ng-controller="modelmonitorcontroller" ng-include="\'includes/basemonitor.html\'">Container1</div>';
        $("#" + containerId, tmpl).append(html);
    };
};
