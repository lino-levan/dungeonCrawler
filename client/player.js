class player {
    constructor(x,y) {
        this.x = x
        this.y = y
        this.velocity = {x:0, y:0}
        this.acceleration = {x:0, y:1}
        this.inventory = []

        this.cooldown = 0

        this.stats = {speed:10}

        this.animation_state = "player_walking_1"

        this.can_jump = false

        this.facing = 1
        this.past = {x:x, y:y}
    }
    
    set_animation_state(state) {
        this.animation_state = state
    }

    draw(debug) {
        this.cooldown++

        // handle animations
        if(this.past.x!==this.x) {
            this.set_animation_state("player_walking_"+(Math.floor(frameCount/5)%2+1))

            this.facing = this.past.x - this.x > 0 ? -1 : 1
        }

        pushMatrix()

        translate(this.x + (this.facing===-1?64:0), this.y)

        scale(this.facing, 1)

        draw_image(this.animation_state, 0, 0, 64, 64)

        popMatrix()

        pushMatrix()

        translate(this.x+32 + (this.facing===-1?-16:16), this.y+48)

        scale(this.facing, 1)

        rotate(sin(frameCount*10)*5)

        draw_image(this.inventory[0], 0, -64, 64, 64)

        popMatrix()

        if(debug) rect(this.x, this.y , 64, 64)

        this.past = {x:this.x, y:this.y}
    }

    collect_item(name) {
        this.inventory.push(name)
    }

    physics_step() {
        if(_world.collision.length>0) {
            this.velocity.x += this.acceleration.x
            this.velocity.y += this.acceleration.y
        }

        this.x += this.velocity.x
        this.y += this.velocity.y

        let collisions = []

        _world.collision.forEach(col=>{
            if(this.check_collision(col[0], col[1], col[2], col[3])) {
                collisions.push(col)
            }
        })

        let y_stop = false

        collisions.forEach((col)=>{
            // rect(col[0],col[1],col[2],col[3])

            while(this.y_causes_collision(col[0],col[1],col[2],col[3])) {
                const y_dir = this.get_y_direction()
                this.y -= y_dir

                y_stop = true

                if(y_dir === 1) {
                    this.can_jump = true
                }
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