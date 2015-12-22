/* global Tentacle, angular */

var mainApp = angular.module("model-monitor", []);

mainApp.controller("modelmonitorcontroller", function ($scope) {

});


Tentacle.MonitorPanel = function () {

    this.create = function () {

        var html = '<div ng-include="\'includes/basemonitor.html\'" ng-controller="modelmonitorcontroller"></div>';

        $("#monitors-container").append(html);
    };
};