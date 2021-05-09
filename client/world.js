class world {
    constructor(){
        this.players = {}

        this.tiles = []

        this.entities = []

        this.collision = []

        this.me = new player(64, 64)

        this.camera = {max:{x:0,y:0}}
    }

    draw() {
        background(255)

        pushMatrix()

        let camera = {x:-_world.me.x + width/2, y:-_world.me.y + height/2}

        camera.x = camera.x>0 ? 0: camera.x
        camera.x = camera.x<-this.camera.max.x ? -this.camera.max.x : camera.x 

        camera.y = camera.y>0 ? 0: camera.y
        camera.y = camera.y<-this.camera.max.y ? -this.camera.max.y : camera.y

        translate(camera.x, camera.y)

        this.tiles.forEach(_tile=>{
            if(_tile.x+64>=-camera.x && _tile.x<=-camera.x+640 && _tile.y>=-camera.y-64 && _tile.y<=-camera.y+640) {
                _tile.draw()
            }
        })

        this.entities.forEach(_entity=>{
            if(_entity.x+64>=-camera.x && _entity.x<=-camera.x+640 && _entity.y>=-camera.y-64 && _entity.y<=-camera.y+640) {
                _entity.draw()
            }
        })

        for(let id in this.players) {
            let p = this.players[id]
            if(id !== socket.id) {
                let pl = new player(p.x, p.y)
    
                pl.facing = p.facing
                pl.inventory = p.inventory
                pl.set_animation_state(p.animation_state)
    
    
                pl.draw()
            }
        }

        this.me.physics_step()

        this.me.draw()

        popMatrix()
    }

    spawn(entity) {
        let clean_entity = entity

        clean_entity.metadata = entity.metadata || {}

        socket.emit('spawn_entity', clean_entity)
    }
}