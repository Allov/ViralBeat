define([], function (audioPlayer) {
    var LOW = 0,
        MID = 1,
        HIGH = 2,
        GLOBAL = 3;

    var amplitudes = [
        new Array(),
        new Array(),
        new Array(),
        new Array()
    ];
    
    var context,
        analyser,
        audio,
        source,
        progression = 0;
    
    var options = {
        lowThreshold: 1.05,
        midThreshold: 1,
        highThreshold: 1.3,
        globalThreshold: 1.1,
        maxAmplitudesDomain: 42
    };
    
    var audioAnalyser = {
        config: function(settings){
            for(var i in settings) {
                options[i] = settings[i];
            }
        },
        
        analyse: function(media) {
            audio = media;
            context = new webkitAudioContext();
            analyser = context.createAnalyser();

            audio.addEventListener('play', analyseData, false);
            audio.addEventListener('timeupdate', progressTime, false);
        },
        
        spectrum: function() {
            var freqByteData = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(freqByteData);
            return freqByteData;
        },
        
        dominantFrequency: function() {
            var freqByteData = audioAnalyser.spectrum();
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
            
        averageFrequency: function(offset, count) {
            var freqByteData = audioAnalyser.spectrum();            
            
            count = count || freqByteData.length;
            offset = offset || 0;

            var sum = 0;
            for(var i = 0; i < count; i++) {
                sum += freqByteData[i+offset];
            }
            
            return sum / freqByteData.length;
        },
        
        lowMidHighAverageFrequencies: function() {
            var freqByteData = audioAnalyser.spectrum();            
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
        progression: progression,

        name: "audioAnalyser",
        update: function () {
            if (!audio) return;
            
            var lmht = audioAnalyser.lowMidHighAverageFrequencies();
        
            amplitudes[LOW].push(lmht.low);
            amplitudes[MID].push(lmht.mid);
            amplitudes[HIGH].push(lmht.high);
            amplitudes[GLOBAL].push(lmht.total);

            for (var a = 0; a < amplitudes.length; a++) {
                if (amplitudes[a].length > options.maxAmplitudesDomain) {
                    var sum = 0;

                    for (var i = 0; i < amplitudes[a].length; i++) {
                        sum += amplitudes[a][i];
                    }

                    var avg = sum / amplitudes[a].length;
                    if (a == LOW && lmht.low > (avg * options.lowThreshold)) {
                        if (audioAnalyser.lowDetected) { audioAnalyser.lowDetected(lmht.low); }
                    } else if (a == LOW) {
                        if (audioAnalyser.lowDetected) { audioAnalyser.lowDetected(0); }
                    }

                    if (a == MID && lmht.mid > (avg * options.midThreshold)) {
                        if (audioAnalyser.midDetected) { audioAnalyser.midDetected(lmht.mid); }
                    } else if (a == MID) {
                        if (audioAnalyser.midDetected) { audioAnalyser.midDetected(0); }
                    }

                    if (a == HIGH && lmht.high > (avg * options.highThreshold)) {
                        if (audioAnalyser.highDetected) { audioAnalyser.highDetected(lmht.high); }
                    } else if (a == HIGH) {
                        if (audioAnalyser.highDetected) { audioAnalyser.highDetected(0); }
                    }

                    if (a == GLOBAL && lmht.total > (avg * options.globalThreshold)) {
                        if (audioAnalyser.globalDetected) { audioAnalyser.globalDetected(lmht.low); }
                    } else if (a == GLOBAL) {
                        if (audioAnalyser.globalDetected) { audioAnalyser.globalDetected(0); }
                    }
                    amplitudes[a].splice(0, 1);
                }
            }

            return lmht;
        }
    }
    
    return audioAnalyser;

    function analyseData() {
        if (!source) {
            source = context.createMediaElementSource(audio);
            source.connect(analyser);
        }
        analyser.connect(context.destination);
        analyser.smoothingTimeConstant = 0.85;
    }
    
    function progressTime() {
        progression = (audio.currentTime / audio.duration);
    }    
});
