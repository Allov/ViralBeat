define(["virality"], function(v) {
    var square = function(settings) {
        this.x = v.viewport.w / 2;
        this.y = v.viewport.h / 2;
        this.size = 50;
        this.color = "#FF0";
        
        for(var i in settings) {
            this[i] = settings[i];
        }
        
        this.name = "square";
        
        this.render = function(context, elapsed) {
            if (this.moving) {
                this.move(elapsed);
            }
            
            context.fillStyle = this.color;
            context.fillRect(this.x - (this.size / 2), this.y - (this.size / 2), this.size, this.size);
            context.strokeStyle = this.color;
            context.strokeRect(this.x - (this.size / 2), this.y - (this.size / 2), this.size, this.size);
        };
        
        this.moveTo = function(x, y, time) {
            this.time = time;
            this.target = {x: x, y: y};
            this.moving = true;
        }

        this.move = function(elapsed) {
            this.time = this.time - elapsed;
            
            var x = (this.target.x - this.x);
            var y = (this.target.y - this.y);
            
            if (this.time < 0) {
                this.x = this.target.x;
                this.y = this.target.y;
                this.moving = false;
                this.time = 0;
                
                if (this.moved) {
                    this.moved();
                }
            } else {
                this.y += Math.floor(y / (this.time / elapsed));
                this.x += Math.floor(x / (this.time / elapsed));
            }
        }
    }
    
    return square;
});