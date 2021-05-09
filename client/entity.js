class entity {
    constructor(type, x, y, metadata) {
        this.type = type
        this.metadata = metadata
        this.x = x
        this.y = y
    }

    draw() {
        if(this.type === 'item') {
            draw_image(this.metadata.name, this.x, this.y - (sin(frameCount*10)*5), 64, 64)
        } else if(this.type === 'arrow') {
            pushMatrix()
            translate(this.x, this.y)
            rotate(this.metadata.rotation)

            draw_image('arrow', this.metadata.facing===-1?-64:0, this.metadata.facing===-1?-64:0, 64, 64)
            popMatrix()
        } else if(this.type === 'slash') {
            pushMatrix()
            translate(this.x, this.y)
            scale(this.metadata.facing, 1)

            draw_image('slash', this.metadata.facing===-1?-64:0, 0, 64, 64)
            popMatrix()
        } else if(this.type === 'slime') {

            if(this.metadata.velocity.y<0) {
                draw_image('slime_bounce_2', this.x, this.y, 64, 64)
            } else {
                draw_image('slime_bounce_1', this.x, this.y, 64, 64)
            }
        } else if(this.type === 'mage') {
            if(this.metadata.velocity.x * this.metadata.facing>0) {
                pushMatrix()
                translate(this.x, this.y)
                scale(this.metadata.facing===0?0:-this.metadata.facing, 1)
                draw_image('mage_walking', this.metadata.facing===1?-64:0, 0, 64, 64)
                popMatrix()
            } else {
                draw_image('mage_idle', this.x, this.y, 64, 64)
            }

        }  else if(this.type === 'bomb') {
            draw_image('bomb_'+Math.ceil(this.metadata.timer/10), this.x, this.y, 64, 64)
        }  else {
            draw_image(this.type, this.x, this.y, 64, 64)
        }

        // kdraw.ctx.strokeStyle = "white"
        // kdraw.ctx.strokeRect(this.x,this.y, 64, 64)
    }
}