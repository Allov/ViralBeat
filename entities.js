// Base
    function Entity(parent, x, y, w, h) {
        this.x = x || 0;
        this.y = y || 0;
        this.w = w || 0;
        this.h = h || 0;
        
        this.parent = parent || new Entity(this);
    };
    Entity.prototype.intersect = function(entity) {
        var distance = Math.sqrt(((this.center().x - entity.center().x)*(this.center().x - entity.center().x)) + ((this.center().y - entity.center().y)*(this.center().y - entity.center().y)));
        return entity.w / 2 + this.w / 2 >= distance;
    };
    
    Entity.prototype.update = function(context, elapsed) {};
    Entity.prototype.render = function(context, elapsed) {};

    Entity.prototype.rotate = function(r, center, elapsed) {
        var px = this.x - center.x;
        var py = this.y - center.y;
        
        var x = px * Math.cos(toRad(r*elapsed)) - py * Math.sin(toRad(r*elapsed));
        var y = px * Math.sin(toRad(r*elapsed)) + py * Math.cos(toRad(r*elapsed));

        this.x = x + center.x;
        this.y = y + center.y;
    };
    
    Entity.prototype.center = function() {
        return {x: this.x + (this.w / 2), y: this.y + (this.h / 2)};
    };
// Base

// Cells
    function Cell(parent, x, y, r, fColor, sColor) {
        if (r <= 0) r = 2;

        Entity.call(this, parent, x, y, r, r);

        this.fColor = fColor;
        this.sColor = sColor;

        this.direction = {x: 0, y: 0};
        this.gotoPosition = {x: 0, y: 0};
        this.velocity = 0.0075;
    }

    Cell.prototype = new Entity();
    Cell.prototype.update = function(context, elapsed) {
        this.direction.x = this.gotoPosition.x - this.x;
        this.direction.y = this.gotoPosition.y - this.y;
        
        this.x = this.x + (this.direction.x * (this.velocity * elapsed));
        this.y = this.y + (this.direction.y * (this.velocity * elapsed));
    };

    Cell.prototype.render = function(context, elapsed) {
        context.beginPath();        
        context.arc((this.parent.x + this.x), (this.parent.y + this.y), (this.w / 2) - 1, 0, 2 * Math.PI);
        context.fillStyle = this.fColor;
        context.fill();
        context.strokeStyle = this.sColor;
        context.stroke();
    };
    
    Cell.prototype.center = function() {
        return {x: this.x, y: this.y};
    };
    
    Cell.prototype.moveTo = function (x, y) {
        if (x <= 0) {
            x = 1;
        }

        if (x >= viewport.width) {
            x = viewport.width - 1;
        }

        if (y <= 0) {
            y = 1;
        }
        
        if (y >= viewport.height) {
            y = viewport.height - 1;
        }

        this.gotoPosition = {x: x, y: y};
    };

    Cell.prototype.changePosition = function () {
        var dirX = Math.floor(Math.random() * 10) % 2 ? -1 : 1;
        var dirY = Math.floor(Math.random() * 10) % 2 ? -1 : 1;
        this.moveTo(this.x + (Math.floor(Math.random() * 100) + 50) * dirX, this.y + (Math.floor(Math.random() * 100) + 50) * dirY);
    };

    function RedBloodCell(x, y, size) {
        Cell.call(this, null, x, y, size, '#FF8888', '#882222');
        this.velocity = 0.0005;
        this.die = Date.now() + 5000;
    }
    
    RedBloodCell.prototype = new Cell();

    function WhiteBloodCell(x, y, size) {
        Cell.call(this, null, x, y, size, '#FFFFFF', '#888888');
        this.velocity = 0.0005;
        this.lastAttack = Date.now();

        this.ow = this.w;
    }

    WhiteBloodCell.prototype = new Cell();

    WhiteBloodCell.prototype.update = function (context, elapsed) {
        if (this.w > this.ow) {
            this.w -= (0.01 * elapsed);
        } else if (this.w < this.ow) {
            this.w = this.ow;
        }

        this.direction.x = this.gotoPosition.x - this.x;
        this.direction.y = this.gotoPosition.y - this.y;

        this.x = this.x + (this.direction.x * (this.velocity * elapsed));
        this.y = this.y + (this.direction.y * (this.velocity * elapsed));
    }

    WhiteBloodCell.prototype.attack = function () {
        if (Date.now() - this.lastAttack > 1000) {
            this.w = this.ow * 2;
            this.changePosition();
            this.lastAttack = Date.now();
        }
    };
    
    function Virus(x, y) {
        Cell.call(this, null, x, y, 15, '#88FF88', '#228822');
        
        this.ateCount = 0;
    };
    
    Virus.prototype = new Cell();

    Virus.prototype.eat = function() {
        this.w += 0.01;
        this.ateCount++;
    };

// Cells
    
// Projectiles
    function Projectile(parent, x, y, r, vx, vy, color) {
        Entity.call(this, parent, x, y, r, r);

        this.velocity = {x: vx, y: vy};
        this.fColor = color;
        this.radius = r;
    }

    Projectile.prototype = new Entity();

    Projectile.prototype.update = function (context, elapsed) {
        this.x = this.x + (this.velocity.x * elapsed);
        this.y = this.y + (this.velocity.y * elapsed);
    };

    Projectile.prototype.render = function (context, elapsed) {
        context.beginPath();
        context.arc((this.parent.x + this.x), (this.parent.y + this.y), (this.w / 2) - 1, 0, 2 * Math.PI);
        context.fillStyle = this.fColor;
        context.fill();
    };

    function Plasma(parent, x, y, vx, vy) {
        Projectile.call(this, parent, x, y, 10, vx, vy, '#CCFFCC');
    }

    Plasma.prototype = new Projectile();

// Projectiles

// Particles
    function Particle(parent, x, y, vx, vy, color) {
        Entity.call(this, parent, x, y, 5, 5);
        
        this.parent = parent;        
        this.alpha = 1.0;
        this.cellColor = color;
        
        this.velX = vx;
        this.velY = vy;

        this.oX = x;
        this.oY = y;
        this.oVX = vx;
        this.oVY = vy;
    }

    Particle.prototype = new Entity();
    Particle.prototype.update = function(context, elapsed) {
        if (this.velX == 0 && this.velY == 0) {
            return;
        }
        
        this.x = (this.x + (this.velX * (0.01 * elapsed)));
        this.y = (this.y + (this.velY * (0.01 * elapsed)));

        this.alpha = this.alpha - 0.0014 * elapsed;
        
        if (this.alpha <= 0) {
            this.reset();
        }

        this.fColor = color(this.cellColor, this.alpha);
        this.sColor = color({r: 128, g: 64, b: 64 }, this.alpha);
    };
    
    Particle.prototype.render = function(context, elapsed) {
        context.beginPath();        
        context.arc(this.x + this.w / 2, this.y + this.h / 2, (this.w / 2) - 1, 0, 2 * Math.PI);
        context.fillStyle = this.fColor;
        context.fill();
        context.strokeStyle = this.sColor;
        context.stroke();
    };
    
    Particle.prototype.reset = function() {
        this.x = this.oX;
        this.y = this.oY;
        this.velX = this.oVX;
        this.velY = this.oVY;
        this.alpha = 1.0;
    };

    function Fountain(x, y, pCount, radius, follow) {
        radius = radius || 500;
        pCount = pCount || 100;

        Entity.call(this, null, x - this.radius / 2, y - this.radius / 2, radius, radius);

        this.radius = radius;
        this.follow = follow;
        this.pCount = pCount;
        this.particles = [];
        this.current = 0;
        var that = this;
        
        function createParticles() {
            for(var i = 0; i < pCount; i++) {
                var particle = new Particle(that, that.w / 2, that.h / 2, 0, 0, {r: 64, g: Math.floor(Math.random() * 256) + 192, b: Math.floor(Math.random() * 192) + 128 });
                that.particles.push(particle);
            }
        }
        
        createParticles();
    }
    
    Fountain.prototype = new Entity();
    Fountain.prototype.update = function(context, elapsed) {
        this.x = this.follow.center().x - (this.w / 2);
        this.y = this.follow.center().y - (this.h / 2);
        
        var particle = this.particles[this.current];
        
        if (particle.velX == 0 && particle.velY == 0 && (this.follow.direction.x != 0 || this.follow.direction.y != 0)) {
            particle.x = this.x + (this.w / 2);
            particle.y = this.y + (this.h / 2);
            particle.velX = (Math.random() * 10) * (this.follow.direction.x > 0 ? -1 : 1);
            particle.velY = (Math.random() * 10) * (this.follow.direction.y > 0 ? -1 : 1);
        }
        
        this.current++;
        if (this.current >= this.pCount) {
            this.current = 0;
        }
        
        for(var i = 0; i < this.particles.length; i++) {
            this.particles[i].update(context, elapsed);
        }
    };
    
    Fountain.prototype.render = function(context, elapsed) {
        for(var i = 0; i < this.particles.length; i++) {
            this.particles[i].render(context, elapsed);
        }
    };
// Particles
    