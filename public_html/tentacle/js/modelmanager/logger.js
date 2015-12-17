/* global Tentacle, _ */

Tentacle.LoggerLevels = {
    LOG: "log",
    WARNING: "warning",
    ERROR: "error"
};

Tentacle.Logger = new function() {
    
    this.sendLog = function (msg, args, level) {
        
        if (!level) {
            level = Tentacle.LoggerLevels.WARNING;
        }
        
        var argsToken = "$$";
        
        if ((typeof args) === "object") {
            
            _.each(args, function (arg) {
                var index = msg.indexOf(argsToken, 1);
                msg = msg.slice(0, index) + arg + msg.slice(index + argsToken.length, msg.length);
            });
            
        } else if (typeof args === "string") {
            
            msg = msg.replace("$$", args);
            
        } else {
            
            console.log(Tentacle.Exceptions.badloggerargs);
            return;
            
        }
        
        switch (level) {
            case Tentacle.LoggerLevels.LOG:
                console.log(msg);
                break;
                
            case Tentacle.LoggerLevels.WARNING:
                console.warn(msg);
                break;
                
            case Tentacle.LoggerLevels.ERROR:
                console.error(msg);
                break;
        }
    };
    
    this.log = function (msg, args) {
        Tentacle.Logger.sendLog(msg, args, Tentacle.LoggerLevels.LOG);
    };
    
    this.warn = function (msg, args) {
        Tentacle.Logger.sendLog(msg, args, Tentacle.LoggerLevels.WARNING);
    };
    
    this.error = function (msg, args) {
        Tentacle.Logger.sendLog(msg, args, Tentacle.LoggerLevels.ERROR);
    };
    
    // aliases
    Tentacle.log = this.log;
    Tentacle.warn = this.warn;
    Tentacle.error = this.error;
}();