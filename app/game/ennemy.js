define(["virality", "game/square"], function(v, square) {
    var ennemy = function(settings) {
        for(var i in settings) {
            this[i] = settings[i];
        }
        
        var sqs = {
            top: new square({x: (v.viewport.w / 2) + (v.viewport.w / 4), y: 0, color: "orange"}),
            bottom: new square({x: (v.viewport.w / 2) + (v.viewport.w / 4), y: v.viewport.h, color: "orange"}),
            right: new square({x: v.viewport.w, y: v.viewport.h / 2, color: "orange"})
        };
        sqs.top.moveTo(sqs.top.x, (v.viewport.h / 2) - (sqs.top.size / 2), 500);
        sqs.bottom.moveTo(sqs.bottom.x, (v.viewport.h / 2) + (sqs.bottom.size / 2), 500);
        sqs.right.moveTo(sqs.top.x + sqs.right.size, sqs.right.y, 500);
        
        var counter = 3;
        
        sqs.top.moved = function() {
            shoot((v.viewport.w / 2) + (v.viewport.w / 4), v.viewport.h / 2);
        }
        sqs.bottom.moved = function() {
            shoot((v.viewport.w / 2) + (v.viewport.w / 4), v.viewport.h / 2);
        }
        sqs.right.moved = function() {
            shoot((v.viewport.w / 2) + (v.viewport.w / 4), v.viewport.h / 2);
        }
        
        for(var i in sqs) {
            v.components(sqs[i]);
        }
        
        function shoot(x, y) {
            counter--;

            if (counter == 0) {
                var spawnPlasma = function() {
                    var plasma = new square({x: x, y: y, color: "#F00", size: 10});
                    plasma.moveTo(0, v.viewport.h / 2, 1000);
                    v.components(plasma);
                }
                spawnPlasma();
                setInterval(spawnPlasma, 600);
            }
        }
    }
    
    return ennemy;
});