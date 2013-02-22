(function($, w, undefined) {
    if (window.webkitURL) window.URL = window.webkitURL;
    
    var audioFiles = [],
        audio,
        playing = false,
        fileReader = new FileReader(),
        context,
        analyser,
        data,
        mySpectrum;
    
    var audioPlayer = {
        getSpectrum: function() {
            var freqByteData = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(freqByteData);
            return freqByteData;
        },
        
        getDominantFrequency: function() {
            var freqByteData = this.getSpectrum();
            var highest = 0;
            var highestFreq = freqByteData[0];
            for(var i = 0; i < freqByteData.length; i++) {
                if (freqByteData[i] > highest) {
                    highest = i;
                    highestFreq = freqByteData[i];
                }
            }
            
            return highest;
        },
            
        getAverageFrequency: function(offset, count) {
            var freqByteData = this.getSpectrum();            
            
            count = count || freqByteData.length;
            offset = offset || 0;

            var sum = 0;
            for(var i = 0; i < count; i++) {
                sum += freqByteData[i+offset];
            }
            
            return sum / freqByteData.length;
        },
        
        getLowMidHighAverageFrequency: function() {
            var freqByteData = this.getSpectrum();            
            count = freqByteData.length;
            
            var numBands = Math.floor(count / 3);
            
            var lmht = {};

            var sum = 0;
            for(var a = 0; a < 3; a++) {
                var lsum = 0;
                for(var i = 0 ; i < numBands; i++) {
                    var c = freqByteData[i + a * numBands];
                    sum += c;
                    lsum += c;
                }
                
                if (a == 0) {
                    lmht.low = lsum / numBands;
                } else if (a == 1) {
                    lmht.mid = lsum / numBands;
                } else {
                    lmht.high = lsum / numBands;
                }
            }
            
            lmht.total = sum / freqByteData.length;
            return lmht;
        },
            
        hasFiles: function() {
            return audioFiles.length > 0;
        },
            
        play: function() {
            if (audioFiles && audioFiles.length > 0) {
                fileReader.readAsDataURL(audioFiles[0]);
                $("#play").attr("src", "./images/play-active.png");
                $("#stop").attr("src", "./images/stop.png");
                playing = true;
            }
        }
    };
    
    function analyseData() {
        source = context.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(context.destination);
        analyser.smoothingTimeConstant = 0.85;
    }    
    
    function progressTime() {
        var percent = (audio.currentTime / audio.duration) * 100;
        $("#playbar-progress").width(percent + "%");
    }
    
    // init
    $(function() {
        var audioFilesInput = $("#audio-files")[0];
        context = new webkitAudioContext();
        analyser = context.createAnalyser();
        
        // Events
        fileReader.onload = function(e) {
            audio = document.createElement('audio');
            audio.setAttribute('src', e.target.result);
            
            audio.addEventListener('play', analyseData, false);
            audio.addEventListener('timeupdate', progressTime, false);
            
            audio.volume = 0.5;
            audio.play();

        }
        
        $("#stop").click(function(e) {
            audio.pause();
            audio.currentTime = 0;
            $("#play").attr("src", "./images/play.png");
            $("#stop").attr("src", "./images/stop-active.png");
            playing = false;
            
            clearInterval(mySpectrum);
        });
        
        $(audioFilesInput).change(function(e) {
            audioFiles = audioFilesInput.files;
        });
    });
    
    window.audioPlayer = audioPlayer;
    
})(jQuery, window);