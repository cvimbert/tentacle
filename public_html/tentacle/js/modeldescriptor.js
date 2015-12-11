/* global Tentacle, _ */

Tentacle.ModelDescriptor = function () {

    var self = this;
    var descriptorsByClasses = {};


    this.load = function (jsonDescriptor) {

        _.each(jsonDescriptor, function (jsonClassDescriptor, classId) {
            var descriptor = new Tentacle.ClassModelDescriptor(jsonClassDescriptor, self);
            descriptorsByClasses[classId] = descriptor;
        });

    };


    this.getClassDescriptor = function (classId) {

        if (!descriptorsByClasses[classId]) {
            Tentacle.Logger.log(Tentacle.Exceptions.cantfinddescriptor, classId);
            return null;
        }

        return descriptorsByClasses[classId];
    };
};


Tentacle.ClassModelDescriptor = function (jsonClassDescriptor, modelDescriptor) {
    
    var self = this;
    
    this.flattenByItem = function (item) {
        var destDesc = {};
        self.flattenByDescItem(item, objectDescriptor, destDesc, 0);
        return destDesc;
    };


    this.flattenByDescItem = function (item, desc, destDesc, indentation) {
        flattenByItemAction(item, desc.attributes, destDesc, indentation);
    };


    this.flattenAttribute = function (item, attribute, attributeId, destDesc, indentation) {

        if (attribute.type !== "LinkedConditionalAttributesSet" && attribute.type !== "include") {
            destDesc[attributeId] = attribute;
            destDesc[attributeId].indentation = indentation;
        }


        if (attribute.type === "ConditionalAttributesSet") {

            if (item && item[attributeId]) {
                var selectedBranch = attribute.attributesSets[item[attributeId]];
                flattenByItemAction(item, selectedBranch, destDesc, indentation + 1);
            }

        } else if (attribute.type === "include") {

            var targetDescriptor = modDescriptor.getUnitDescriptor(attribute.includetype).getRaw();
            self.flattenAttribute(item, targetDescriptor, attributeId, destDesc, indentation);

        } else if (attribute.type === "LinkedConditionalAttributesSet") {

            if (attribute.linktype === "referenceattributevalue") {
                var refItemId = item[attribute.linkedreference];

                if (refItemId) {

                    // recupération de l'objet qui possède cet id
                    var targetItem = modelManager.getItem(refItemId);

                    // récupération de la propriété qui nous intéresse dans cet objet
                    var targetItemSelectedValue = targetItem[attribute.linkedattribute];

                    // choix de la branche fonction de cette propriété
                    var selectedBranch = attribute.attributesSets[targetItemSelectedValue];

                    // et flatten de la branche
                    flattenByItemAction(item, selectedBranch, destDesc, indentation);
                }
            }

            if (attribute.linktype === "attributevaluenonull") {

                if (item[attribute.link]) {

                    var selectedBranch = attribute.attribute;
                    flattenByItemAction(item, selectedBranch, destDesc, indentation);
                }
            }

        }
    };


    function flattenByItemAction(item, attributes, destDesc, indentation) {

        _.each(attributes, function (attribute, attributeId) {
            self.flattenAttribute(item, attribute, attributeId, destDesc, indentation);
        });
    }
};