define(["virality", "components/heartbeat", "components/fps", "game/viralbeat"],
    function(v, h, fpsCounter, viralBeat) {
    
        var ratio = 5 / 3;
        var width = window.innerWidth > 1280 ? 1280 : window.innerWidth;
        var height = Math.floor(width / ratio) > 768 ? 768 : Math.floor(width / ratio);

        if (height > window.innerHeight) {
            height = window.innerHeight;
            width = Math.floor(height * ratio);
        }
        
        // Starting Virality.
        v.config({ debug: true })
         .init(width, height, "viralbeat")
         .background("#000")
         .start();
        
        // Creating a new entity that is also a component.
        var fps = new fpsCounter();
        v.components(viralBeat);
        v.components(fps);

        // Disable default behaviour for touch device.
        document.addEventListener("touchstart", function(e) {
            e.preventDefault();
        }, false);
    });