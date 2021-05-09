class gui {
  constructor(inventory) {
    this.inventory = inventory
  }

  draw() {
    fill(0,0,0,100)
    stroke(200)
    strokeWeight(5)

    for(let i = 0;i<this.inventory.length;i++) {
      let x = ((width/2) - (this.inventory.length/2 * 75)) + i*75
      // rect(x,height-77,75,75);
      // draw_image(this.inventory[i], x ,height-77,75,75)
    }
  }

  setInventory(inventory) {
    this.inventory = inventory
  }
}
