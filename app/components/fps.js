define(["virality"], function(v) {
    var fps = function(settings) {
        var self = this;
    
        var options = {
            x: 30,
            y: 30
        };
        
        self.name = "fpsCounter";
        self.config = function(settings) {
            for(var i in settings) {
                options[i] = settings[i];
            }
        };
        self.render = function(context, elapsed) {
            context.font = "30px Trebuchet MS";
            context.fillStyle = 'white';
            context.fillText(v.fps() + " FPS", options.x, options.y);
        };
        
        self.config(settings);
    };
    
    return fps;
});