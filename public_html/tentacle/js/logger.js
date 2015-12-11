/* global Tentacle, _ */

Tentacle.LoggerLevels = {
    LOG: "log",
    WARNING: "warning",
    ERROR: "error"
};

Tentacle.Logger = new function() {
    
    this.log = function (msg, args, level) {
        
        if (!level) {
            level = Tentacle.LoggerLevels.WARNING;
        }
        
        var argsToken = "$$";
        
        if (typeof args === "array") {
            
            _.each(args, function (arg) {
                var index = msg.indexOf(argsToken, 1);
                msg = msg.slice(0, index - 1) + arg + msg.slice(index + argsToken.length, msg.length - 1);
            });
            
        } else if (typeof args === "string") {
            
            msg = msg.replace("$$", args);
            
        } else {
            
            console.log(Tentacle.Exceptions.bagloggerargs);
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
}();