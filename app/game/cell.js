define([], function() {
    var cell = function(settings) {
        var self = this;
        self.fColor = "#999";
        self.sColor = "#FFF";
        
        for(var i in settings) {
            self[i] = settings[i];
        }

        self.name = "A cell in ViralBeat";
        self.render = function(context, elapsed) {
                        context.beginPath();        
                        context.arc(self.x, self.y, (self.size / 2) - 1, 0, 2 * Math.PI);
                        context.fillStyle = self.fColor;
                        context.fill();
                        context.strokeStyle = self.sColor;
                        context.stroke();
                    };
    };

    return cell;
});