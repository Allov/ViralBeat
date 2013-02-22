function toRad(value) {
    return value * Math.PI / 180;
}

function color(rgb, alpha) {
    return 'rgba(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ', ' + alpha + ')';
}

// Game.js
(function($, w, audioPlayer, ui, undefined) {
    
    var requestAnimationFrame =
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        window.oRequestAnimationFrame;
    
    // Engine stuff
    var lastUpdate = Date.now(),
        fpsCurrent = 0,
        fpsCount = 0,
        elapsedTime = 0,
        viewport,
        context;
    
    // Game stuff
    var virus,
        fountain,
        started = false,
        startBox,
        entities = [],
        lastFreqCheck = Date.now(),
        rCells = [],
        wCells = [],
        projectiles = [],
        hitAlpha = 0,
        lastHit = Date.now(),
        gotAway = 0,
        lastShot = Date.now(),
        spawnRedCell = spawnWhiteCell = heartBeat = 0;

    var beatDetector,
        cellSpawner;
    
    var MAXREDCELLS = 150,
        MAXWHITECELLS = 50,
        TIMEBETWEENSHOT = 300;
    
    var animationLoop = function () {
        var now = Date.now();
        var elapsed = (now - lastUpdate);
        lastUpdate = now;
        elapsedTime += elapsed;

        update(elapsed);
        render(elapsed);

        fpsCount++;
        
        if (elapsedTime >= 1000) {
            fpsCurrent = fpsCount;
            elapsedTime = 0;
            fpsCount = 0;
        }
        requestAnimationFrame(animationLoop);
    }
    
    function update(elapsed) {        
        beatDetector.computeBeatChanges();
        checkSpawnConditions();
        handleRedCells(context, elapsed);
        handleWhiteCells(context, elapsed);
        handleProjectiles(context, elapsed);
        
        if (started && Date.now() - lastShot > TIMEBETWEENSHOT) {

            //var dirX = virus.direction.x > 0 ? 1 : -1;
            //var dirY = virus.direction.y > 0 ? 1 : -1;

            var m = Math.abs(Math.sqrt((virus.direction.x * virus.direction.x) + (virus.direction.y * virus.direction.y)));
            var dirX = virus.direction.x / m;
            var dirY = virus.direction.y / m;

            projectiles.push(new Plasma(null, virus.x, virus.y, dirX * 0.6, dirY * 0.6));
            lastShot = Date.now();
        }

        if (heartBeat > 0) {
            heartBeat = 0;
        }

        for(var i = 0; i < entities.length; i++) {
            entities[i].update(context, elapsed);
        }
    }
    
    function handleProjectiles(context, elapsed) {
        var deadCells = [];
        for (var i = 0; i < projectiles.length; i++) {
            projectiles[i].update(context, elapsed);

            for (var j = 0; j < wCells.length; j++) {
                if (wCells[j].intersect(projectiles[i])) {
                    deadCells.push(j);
                }
            }
        }

        for (var i = 0; i < deadCells.length; i++) {
            wCells.splice(deadCells[i], 1);
        }
    }

    function handleWhiteCells(context, elapsed) {
        var deadCells = [];
        for (var i = 0; i < wCells.length; i++) {
            if (heartBeat > 0) {
                wCells[i].attack();
            }

            wCells[i].update(context, elapsed);

            if (Date.now() - lastHit > 1000 && wCells[i].intersect(virus)) {
                hitAlpha = 1.0;
                lastHit = Date.now();
            }
        }

        if (spawnWhiteCell > 0) {
            spawnWhiteCell = 0;
        }
    }

    function handleRedCells(context, elapsed) {
        var deadCells = [];
        for (var i = 0; i < rCells.length; i++) {
            if (heartBeat > 0) {
                var dirX = Math.floor(Math.random() * 10) % 2 ? -1 : 1;
                var dirY = Math.floor(Math.random() * 10) % 2 ? -1 : 1;
                rCells[i].moveTo(rCells[i].x + (Math.floor(Math.random() * 100) + 50) * dirX, rCells[i].y + (Math.floor(Math.random() * 100) + 50) * dirY);
            }

            rCells[i].update(context, elapsed);

            var ate = rCells[i].intersect(virus);
            if (Date.now() - rCells[i].die > 0 || ate) {
                deadCells.push(i);

                if (!ate) {
                    gotAway++;
                    $("#gotaway-count").html("&nbsp;GOT AWAY: " + gotAway);
                }
            }

            if (ate) {
                virus.eat();
                $("#ate-count").html("KILLED: " + virus.ateCount);
            }


        }

        for (var i = 0; i < deadCells.length; i++) {
            rCells.splice(deadCells[i], 1);
        }

        $("#alive-count").html("&nbsp;ALIVE: " + rCells.length);

        if (spawnRedCell > 0) {
            spawnRedCell = 0;
        }
    }

    function checkSpawnConditions() {
        if (spawnRedCell > 0 && rCells.length < MAXREDCELLS) {
            var rCell = cellSpawner.spawnRedCell(spawnRedCell);
            rCells.push(rCell);
        }

        if (spawnWhiteCell > 0 && wCells.length < MAXWHITECELLS) {
            var wCell = cellSpawner.spawnWhiteCell(spawnWhiteCell);
            wCells.push(wCell);
        }
    }
    
    function render(elapsed) {
        ui.clear(context, '#000');
        context.fillStyle = 'rgba(255, 0, 0, ' + hitAlpha + ')';
        context.fillRect(0, 0, viewport.width, viewport.height);

        if (hitAlpha > 0) {
            hitAlpha -= 0.01;
        }
        
        ui.drawFPS(context, fpsCurrent);
        
        if (!started) {
            ui.drawMenu(context, elapsed);
        }

        for (var i = 0; i < projectiles.length; i++) {
            projectiles[i].render(context, elapsed);
        }

        for (var i = 0; i < wCells.length; i++) {
            wCells[i].render(context, elapsed);
        }

        for(var i = 0; i < rCells.length; i++) {
            rCells[i].render(context, elapsed);
        }

        for(var i = 0; i < entities.length; i++) {
            entities[i].render(context, elapsed);
        }
    }
    
    function startGame() {
        $("#game-board").css('cursor', 'none');
        started = true;
        virus = new Virus(viewport.width / 2, viewport.height / 2);
        fountain = new Fountain(viewport.width / 2, viewport.height / 2, 50, 300, virus);
        entities.push(fountain);
        entities.push(virus);
        
        audioPlayer.play();
    }
    
    function initializeEvents() {
        $('#viewport').mousemove(function (e) {
            if (started) {
                virus.moveTo(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
            }
        });

        $('#viewport').click(function (e) {
            if (started) {
                return;
            }

            var x = e.pageX - this.offsetLeft;
            var y = e.pageY - this.offsetTop;

            if (x >= viewport.width / 2 - 100 && x <= viewport.width / 2 + 100 &&
                y >= viewport.height / 2 - 25 && y <= viewport.height / 2 + 25) {
                if (audioPlayer.hasFiles()) {
                    startGame();
                }
            }
        });

        beatDetector.lowDetected = function (low) {
            ui.lowDetected(low);
            spawnWhiteCell = low;
        }

        beatDetector.midDetected = function (mid) {
            ui.midDetected(mid);
            spawnRedCell = mid;
        }

        beatDetector.highDetected = function (high) {
            ui.highDetected(high);
        }

        beatDetector.globalDetected = function (global) {
            ui.globalDetected(global);
            heartBeat = global;
        }

    }

    // Init
    $(function () {
        beatDetector = new BeatDetector(audioPlayer);
        cellSpawner = new CellSpawner();

        viewport = document.getElementById('viewport');
        context = viewport.getContext('2d');
        requestAnimationFrame(animationLoop);
        
        initializeEvents();
    });
})(jQuery, window, window.audioPlayer, window.ui);