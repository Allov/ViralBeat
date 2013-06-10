define(["virality", "components/sprite", "components/starfield", "components/audioanalyser", "game/ennemy"],
    function(v, sprite, starfield, audioAnalyser, ennemy) {
        var viralBeat = {
            name: "ViralBeat Main Game",
            init: function() {
                sprite.create(32, "sprites.png", {
                    ship: [0, 0],
                    bomb: [1, 0]
                });

                v.components(starfield);
                
                var e1 = new ennemy({x: 100, y: 100});
                v.components(e1);
                
                /*
                var audio = v.load("test.ogg");
                
                audioAnalyser.globalDetected = function(global) {
                    if (global > 0) {
                        v.log("Beat detected: " + global, "main");
                    }
                }
                
                audio.play();
                audioAnalyser.analyse(audio);
                v.components(audioAnalyser);
                */
            }
        }   
        
        return viralBeat;
    });