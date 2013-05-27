define(["virality"], function(v) {
    var layers = [];
    var layersVelocity = [0.25, 0.1, 0.05];

    var layersPosition = [
        {x: 0, y: 0},
        {x: 0, y: 0},
        {x: 0, y: 0}
    ];
    
    var layersColors = [
        [192, 192, 192, 255],
        [128, 128, 128, 255],
        [96, 96, 96, 255]
    ];
    
    var starsSpec = [
        {w: 4, h: 2},
        {w: 2, h: 2},
        {w: 2, h: 1}
    ];
    
    var starCount = 100,
        layerCount = 3;
        
    var starfield = {
        name: "Starfield",
        init: function() {
            
            for(var i = 0; i < layerCount; i++) {
                var layer = document.createElement("canvas");
                layer.width = v.viewport.w;
                layer.height = v.viewport.h;
                layers.push(layer);
            }
            
            for(var j in layers) {
                for(var i = 0; i < starCount; i++) {
                    var context = layers[j].getContext("2d");
                    var x = Math.floor((Math.random() * layers[j].width) + 1);
                    var y = Math.floor((Math.random() * layers[j].height) + 1);
                    
                    if (v.viewport.w - x <= starsSpec[j].w) { x -= v.viewport.w - starsSpec[j].w }
                    if (x <= starsSpec[j].w) { x += starsSpec[j].w }
                    
                    context.fillStyle = "rgba(" + layersColors[j][0] + "," + layersColors[j][1] + "," + layersColors[j][2] + "," + layersColors[j][3] + ")";
                    context.fillRect(x, y, starsSpec[j].w, starsSpec[j].h);
                }
            }
        },
        render: function(context, elapsed) {
            for(var i in layers) {
                layersPosition[i].x += layersVelocity[i] * elapsed;

                var width = layers[i].width - layersPosition[i].x;
                
                if (width < 1) width = 1;
                if (width > v.viewport.w) {
                    width = v.viewport.w;
                }
                
                context.drawImage(layers[i], 
                    layersPosition[i].x, layersPosition[i].y, 
                    width, v.viewport.h, 
                    0, 0, 
                    width, v.viewport.h);
                
                /*context.strokeStyle = "#F00";
                context.lineWidth = 1;
                context.strokeRect(0, 0, width, v.viewport.h);*/
                
                var followWidth = v.viewport.w - width;
                context.drawImage(layers[i], 
                    1, layersPosition[i].y, 
                    followWidth, v.viewport.h, 
                    width, 0, 
                    followWidth, v.viewport.h);

                /*context.strokeStyle = "#0F0";
                context.lineWidth = 1;
                context.strokeRect(width, 0, followWidth, v.viewport.h);*/

                if (layersPosition[i].x >= (v.viewport.w - 2)) {
                    layersPosition[i].x = 0;
                }
            }
            
        }
    };
    
    return starfield;
});