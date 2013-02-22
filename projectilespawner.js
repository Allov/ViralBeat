(function (undefined) {

    var projectiles = [];

    var ProjectileSpawner = function() {
    }

    ProjectileSpawner.prototype.spawnPlasma = function (x, y, vx, vy) {
        return new Plasma(null, x, y,
    };

    ProjectileSpawner.prototype.update = function (context, elapsed) {
        for (var i = 0; i < projectiles.length; i++) {
            
            

        }
    };

    ProjectileSpawner.prototype.render = function (context, elapsed) {
        for (var i = 0; i < projectiles.length; i++) {
            projectiles[i].render(context, elapsed);
        }
    };

    window.ProjectileSpawner = ProjectileSpawner;
})();