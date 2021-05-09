class tile {
    constructor(texture, x, y) {
        this.x = x
        this.y = y

        this.texture = texture

        this.ready = false
    }

    draw() {
        draw_image(this.texture, this.x, this.y, 64, 64);

        if(this.texture==='torch_'+this.texture[this.texture.length-1]) {
            this.texture = 'torch_'+((Math.floor(frameCount/20)%4)+1)
        }
    }
}