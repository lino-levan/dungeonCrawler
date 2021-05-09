var _colliders = []


class physics_object {
    constructor(x, y, velocity) {
        this.x = x
        this.y = y
        this.velocity = velocity
    }

    physics_step() {
        let collisions = []

        _colliders.forEach(col=>{
            if(this.check_collision(col[0], col[1], col[2], col[3])) {
                collisions.push(col)
            }
        })

        let y_stop = false

        collisions.forEach((col)=>{
            while(this.y_causes_collision(col[0],col[1],col[2],col[3])) {
                const y_dir = this.get_y_direction()
                this.y -= y_dir

                y_stop = true
            }

            while(this.x_causes_collision(col[0],col[1],col[2],col[3])) {
                const x_dir = this.get_x_direction()
                this.x -= x_dir
            }
        })

        if(y_stop) {
            this.velocity.y = 2
        } else {
            this.can_jump = false
        }

        if(this.velocity.y>50) {
            this.velocity.y = 50
        }

        if(Math.abs(this.velocity.x)>30) {
            this.velocity.x = this.velocity.x > 0?30:-30
        }

    }
    
    check_collision(x2,y2,w2,h2) {
        if (this.x < x2 + w2 &&
            this.x + 64 > x2 &&
            this.y < y2 + h2 &&
            this.y + 64 > y2) {
            return true
        }
    
        return false
    }

    x_causes_collision(x,y,w,h) {
        const direction = this.get_x_direction();
        const move = this.velocity.x;
        const hasCollision = this.check_collision(x,y,w,h);
        this.x -= move;
        const hadCollision = this.check_collision(x,y,w,h);
        this.x += move;
        return hasCollision && !hadCollision;
    }

    get_x_direction() {
        if(this.velocity.x === 0) {
            return 0
        } else {
            return this.velocity.x > 1?1:-1
        }
    }

    y_causes_collision(x,y,w,h) {
        const direction = this.get_y_direction();
        const move = this.velocity.y;
        const hasCollision = this.check_collision(x,y,w,h);
        this.y -= move;
        const hadCollision = this.check_collision(x,y,w,h);
        this.y += move;
        return hasCollision && !hadCollision;
    }

    get_y_direction() {
        if(this.velocity.y === 0) {
            return 0
        } else {
            return this.velocity.y > 1?1:-1
        }
    }
}

module.exports = (x, y, velocity, colliders)=>{
    _colliders = colliders

    var _physics = new physics_object(x,y,velocity)

    _physics.physics_step()

    return {x:_physics.x, y:_physics.y, velocity: _physics.velocity}
}