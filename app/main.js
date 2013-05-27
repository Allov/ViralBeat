define(["virality", "components/heartbeat", "components/sprite", 
        "components/starfield", "components/fps"],
    function(v, h, sprite, starfield, fpsCounter) {
    
        // Starting Virality.
        v.config({ debug: true })
         .init(640, 480)
         .background("#000")
         .start();
        
        // Adding a Starfield.
        v.components(starfield);

        // Creating a new entity that is also a component.
        var fps = new fpsCounter();
        v.components(fps);
         
        // Handles pause and unpause.
        document.getElementById("pause")
                .onclick = function() {
                    v.pause();
                    if (v.isPaused) {
                        this.innerHTML = "Unpaused";
                    } else {
                        this.innerHTML = "Pause";
                    }
                };
    
    });