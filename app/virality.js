define([], function() {
    var requestAnimationFrame =
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        window.oRequestAnimationFrame;        

    var canvas,
        buffer,
        context,
        contextBuffer,
        lastUpdate = Date.now(),
        fpsCurrent = 0,
        fpsCount = 0,
        elapsedTime = 0,
        components = [],
        assets = [],
        pause = false;;

    var options = {
        viewport: {},
        background: "#000",
        debug: true,
        assetsPath: "assets/"
    };
    
    var virality = {
        config: function(settings) {
            for(var i in settings) {
                options[i] = settings[i];
            }
            
            return virality;
        },
        init: function(w, h, canvasId) {
            options.viewport.w = w || 320;
            options.viewport.h = h || 200;
            
            if (!canvasId) {
                canvas = document.createElement("canvas");
                canvas.id = "virality";
                document.body.appendChild(canvas);
            } else {
                canvas = document.getElementById(canvasId);
            }

            buffer = document.createElement("canvas");

            canvas.width = buffer.width = options.viewport.w;
            canvas.height = buffer.height = options.viewport.h;
            
            context = canvas.getContext("2d");
            contextBuffer = buffer.getContext("2d");

            return virality;
        },
        update: function(elapsed) {
            for(var i in components) {
                if (components[i].update) {
                    components[i].update(elapsed);
                }
            }
        },
        render: function(elapsed) {
            contextBuffer.clearRect(0, 0, options.viewport.w, options.viewport.h);
            contextBuffer.fillStyle = options.background;
            contextBuffer.fillRect(0, 0, options.viewport.w, options.viewport.h);
            
            for(var i in components) {
                if (components[i].render) {
                    components[i].render(contextBuffer, elapsed);
                }
            }
            
            context.drawImage(buffer, 0, 0, options.viewport.w, options.viewport.h);
        },
        start: function() {
            requestAnimationFrame(loop);
            return virality;
        },
        background: function(color) { 
            options.background = color;
            return virality;
        },
        fps: function() {
            return fpsCurrent;
        },
        load: function(asset) {
            if (typeof(asset) == "string") {
                asset = {
                    name: asset,
                    media: asset
                };
            }
            
            var path = options.assetsPath + asset.media;
            
            if (!assets[asset.name]) {
                virality.log("Loading asset: " + asset.name + "[" + path + "]", "loader");
                var image = new Image();
                image.src = path;
                
                assets[asset.name] = image;
            }
        },
        components: function(component) {
            if (component.name) {
                virality.log("Adding: " + component.name, "components");
            }
            components.push(component);
            
            if (component.init) {
                component.init();
            }

            return component;
        },
        assets: assets,
        viewport: options.viewport,
        log: function(message, component) {
            if (options.debug && console) {
                console.log({ message: message, component: component });
            }
        },
        pause: function() {
            pause = !pause;
        },
        isPaused: function() {
            return pause;
        }
    };
    
    return virality;
    
    function loop() {
        var now = Date.now();
        var elapsed = (now - lastUpdate);
        lastUpdate = now;
        elapsedTime += elapsed;

        if (!pause) {
            virality.update(elapsed);
            virality.render(elapsed);
        }

        fpsCount++;
        
        if (elapsedTime >= 1000) {
            fpsCurrent = fpsCount;
            elapsedTime = 0;
            fpsCount = 0;
        }
        
        requestAnimationFrame(loop);
    }
});