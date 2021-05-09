class tile {
    constructor(texture, x, y) {
        this.x = x
        this.y = y

        this.texture = texture

        this.ready = false
    }

    draw() {
        draw_image(this.texture, this.x, this.y, 64, 64);

        if(/^.*_\d*$/gm.test(this.texture)) {
          let repeat_after = 1

          while(textures[this.texture.match(/^.*_/gm)+repeat_after] !== undefined) {
            repeat_after++
          }

          repeat_after--

          this.texture = this.texture.match(/^.*_/gm) + ((Math.floor(frameCount/20)%repeat_after)+1)
        }
    }
}
