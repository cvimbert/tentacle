/* global Tentacle, _ */

Tentacle.MonitorPanelsSet = function (id, panelDesc, htmlTemplate) {

    this.template = $(htmlTemplate);

    this.init = function () {
        for (var uPanelId in panelDesc.panels) {
            var uPanelDesc = panelDesc.panels[uPanelId];

            var panel = new Tentacle.MonitorPanel(uPanelId, uPanelDesc, this);
            panel.create();
        }

        for (var buttonId in panelDesc.buttons) {
            var buttonDesc = panelDesc.buttons[buttonId];

            var button = new Tentacle.MonitorButton(buttonId, buttonDesc, this);
            button.create();
        }
        
        if (panelDesc.css) {
            this.template.addClass(panelDesc.css);
        }
        
        this.template.addClass(id);

        if (panelDesc.title) {
            $("#title", this.template).append(panelDesc.title);
        }
    };
};

Tentacle.MonitorButton = function (id, buttonDescriptor, panelsSet) {

    this.create = function () {
        var tp = _.template('<button id="<%= id %>" ng-click="<%= onclick %>" type="button" class="btn"><%= label %></button>');

        var clickAction = "";

        if (buttonDescriptor.action) {
            if (buttonDescriptor.action.type === "navigatetopanel") {
                clickAction = "navigateTo('" + buttonDescriptor.action.panelid + "')";
            }
        }

        var html = tp({
            id: id,
            label: buttonDescriptor.label,
            onclick: clickAction
        });
        
        html = $(html);
        
        if (buttonDescriptor.css) {
            html.addClass(buttonDescriptor.css);
        } else {
            html.addClass("btn-primary");
        }

        $("#" + buttonDescriptor.containerid, panelsSet.template).append(html);
    };
};

Tentacle.MonitorPanel = function (id, panelDesc, panelsSet) {

    this.create = function () {
        var tp = _.template('<div id="<%= id %>" ng-init="name=\'<%= name %>\'; modeltype=\'<%= modeltype %>\'; getModels();" ng-controller="<%= controller %>" ng-include="\'<%= monitortemplate %>\'">Container1</div>');
        
        var template;
        
        if (panelDesc.template) {
            template = panelDesc.template;
        } else {
            // TODO: temporaire, mettre un attribut de template par défaut dans la conf
            template = "includes/basemonitor.html";
        }
        
        var controller;
        
        if (panelDesc.controller) {
            controller = panelDesc.controller;
        } else {
            controller = "modelmonitorcontroller";
        }
        
        var html = tp({
            id: id,
            name: panelDesc.name,
            modeltype: panelDesc.type,
            monitortemplate: template,
            controller: controller
        });
        
        html = $(html);
        
        if (panelDesc.css) {
            html.addClass(panelDesc.css);
        }
        
        html.addClass(id);

        $("#" + panelDesc.containerid, panelsSet.template).append(html);
    };
};