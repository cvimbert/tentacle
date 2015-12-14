var Tentacle = {};

Tentacle.BaseObjectTypes = {
    STRING: "string",
    BOOLEAN: "boolean",
    NUMBER: "number"
}, Tentacle.Exceptions = {
    cantfinddescriptor: "Can't find ClassDescriptor $$ in descriptors",
    badloggerargs: "Bad logger arguments",
    verywell: "Everything is fine !"
}, Tentacle.LoggerLevels = {
    LOG: "log",
    WARNING: "warning",
    ERROR: "error"
}, Tentacle.Logger = new function() {
    this.sendLog = function(a, b, c) {
        c || (c = Tentacle.LoggerLevels.WARNING);
        var d = "$$";
        if ("array" == typeof b) _.each(b, function(b) {
            var c = a.indexOf(d, 1);
            a = a.slice(0, c - 1) + b + a.slice(c + d.length, a.length - 1);
        }); else {
            if ("string" != typeof b) return void console.log(Tentacle.Exceptions.badloggerargs);
            a = a.replace("$$", b);
        }
        switch (c) {
          case Tentacle.LoggerLevels.LOG:
            console.log(a);
            break;

          case Tentacle.LoggerLevels.WARNING:
            console.warn(a);
            break;

          case Tentacle.LoggerLevels.ERROR:
            console.error(a);
        }
    }, this.log = function(a, b) {
        Tentacle.Logger.sendLog(a, b, Tentacle.LoggerLevels.LOG);
    }, this.warn = function(a, b) {
        Tentacle.Logger.sendLog(a, b, Tentacle.LoggerLevels.WARNING);
    }, this.error = function(a, b) {
        Tentacle.Logger.sendLog(a, b, Tentacle.LoggerLevels.ERROR);
    }, Tentacle.log = this.log, Tentacle.warn = this.warn, Tentacle.error = this.error;
}(), Tentacle.ModelDescriptor = function(a) {
    var b = this, c = {};
    this.load = function(d) {
        _.each(d, function(d, e) {
            var f = new Tentacle.ClassModelDescriptor(e, d, b, a);
            c[e] = f;
        });
    }, this.getClassDescriptor = function(a) {
        return c[a] ? c[a] : (Tentacle.Logger.log(Tentacle.Exceptions.cantfinddescriptor, a), 
        null);
    };
}, Tentacle.ClassModelDescriptor = function(a, b, c, d) {
    function e(a, b, c, d) {
        _.each(b, function(b, e) {
            f.flattenAttribute(a, b, e, c, d);
        });
    }
    var f = this;
    this.getRaw = function() {
        return b;
    }, this.getAttributes = function() {
        return b.attributes;
    }, this.getAttribute = function(a) {
        return getAttributes()[a];
    }, this.getClone = function() {
        var a = JSON.stringify(b);
        return JSON.parse(a);
    }, this.getObjectBySource = function(b) {
        var c = {};
        b && b.uid && (c.uid = b.uid), b && b.type && (c.type = b.type);
        var d = f.flattenByItem(b);
        return f.getObject(d, b, c), c.uid || (c.uid = uuid.v4()), c.type || (c.type = a), 
        c;
    }, this.getObject = function(a, b, c) {
        _.each(a, function(a, d) {
            if (b && b[d]) a.type === Tentacle.ModelDecriptorTypes.CONDITIONAL_ATTRIBUTES_SET ? (c[d] = b[d], 
            f.getObject(a.attributesSets[b[d]], b, c)) : c[d] = b[d]; else switch (a.type) {
              case Tentacle.BaseObjectTypes.STRING:
                c[d] = "";
                break;

              case Tentacle.BaseObjectTypes.NUMBER:
                a.defaultvalue ? c[d] = a.defaultvalue : c[d] = 0;
                break;

              case Tentacle.BaseObjectTypes.BOOLEAN:
                a.defaultvalue ? c[d] = a.defaultvalue : c[d] = "false";
                break;

              case Tentacle.ModelDecriptorTypes.CONDITIONAL_ATTRIBUTES_SET:
                c[d] = "";
                break;

              case Tentacle.ModelDecriptorTypes.COLLECTION:
                c[d] = [];
                break;

              default:
                c[d] = "";
            }
        });
    }, this.flattenByItem = function(a) {
        var c = {};
        return f.flattenByDescItem(a, b, c, 0), c;
    }, this.flattenByDescItem = function(a, b, c, d) {
        e(a, b.attributes, c, d);
    }, this.flattenAttribute = function(a, b, g, h, i) {
        if (b.type !== Tentacle.ModelDecriptorTypes.LINKED_CONDITIONAL_ATTRIBUTES_SET && b.type !== Tentacle.ModelDecriptorTypes.INCLUDE && (h[g] = b, 
        h[g].indentation = i), b.type === Tentacle.ModelDecriptorTypes.CONDITIONAL_ATTRIBUTES_SET) {
            if (a && a[g]) {
                var j = b.attributesSets[a[g]];
                e(a, j, h, i + 1);
            }
        } else if (b.type === Tentacle.ModelDecriptorTypes.INCLUDE) {
            var k = c.getClassDescriptor(b.includetype).getRaw();
            f.flattenAttribute(a, k, g, h, i);
        } else if (b.type === Tentacle.ModelDecriptorTypes.LINKED_CONDITIONAL_ATTRIBUTES_SET) {
            if (b.linktype === Tentacle.ModelDecriptorTypes.REFERENCE_ATTRIBUTE_VALUE) {
                var l = a[b.linkedreference];
                if (l) {
                    var m = d.getItem(l), n = m[b.linkedattribute], j = b.attributesSets[n];
                    e(a, j, h, i);
                }
            }
            if ("attributevaluenonull" === b.linktype && a[b.link]) {
                var j = b.attribute;
                e(a, j, h, i);
            }
        }
    };
}, Tentacle.ModelDecriptorTypes = {
    CONDITIONAL_ATTRIBUTES_SET: "ConditionalAttributesSet",
    COLLECTION: "collection",
    LINKED_CONDITIONAL_ATTRIBUTES_SET: "LinkedConditionalAttributesSet",
    INCLUDE: "include",
    REFERENCE_ATTRIBUTE_VALUE: "referenceattributevalue"
}, Tentacle.ModelManager = function() {};

var Tentacle = {};
//# sourceMappingURL=tentacle.map