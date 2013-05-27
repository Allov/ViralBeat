define(["virality", "components/heartbeat", "components/sprite", 
        "components/starfield", "components/fps", "components/audioanalyser"],
    function(v, h, sprite, starfield, fpsCounter, audioAnalyser) {
    
        // Starting Virality.
        v.config({ debug: true })
         .init(640, 480, "viralbeat")
         .background("#000")
         .start();
        
        // Adding a Starfield.
        v.components(starfield);

        // Creating a new entity that is also a component.
        var fps = new fpsCounter();
        v.components(fps);
        
        var audio = v.load("test.mp3");
        
        audioAnalyser.globalDetected = function(global) {
            if (global > 0) {
                v.log("Beat detected: " + global, "main");
            }
        }
        
        //audioAnalyser.analyse(audio);
        v.components(audioAnalyser);
         
        document.getElementById("pause")
                .onclick = function() {
                    v.pause();
                    if (v.isPaused) {
                        this.innerHTML = "Unpaused";
                    } else {
                        this.innerHTML = "Pause";
                    }
                };
                
        document.getElementById("play")
                .onclick = function() {
                    audio.play();
                };

        document.getElementById("stop")
                .onclick = function() {
                    audio.pause();
                    audio.currentTime = 0;
                };
    });