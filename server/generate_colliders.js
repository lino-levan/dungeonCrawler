var hitbox = {wooden_bridge:[0,0,64,16], wall:[0,0,64,64]}
let colliders = []

function connect(x,y,w,h) {
    let connected = false
    for(let i = 0;i<colliders.length;i++) {
        if(y===colliders[i][1]+colliders[i][3] && x===colliders[i][0]) {
            colliders[i][3] += h
            connected = true
        }
    }

    if(!connected) {
        colliders.push([x,y,w,h])
    }
}

module.exports = (tiles)=>{

    tiles.forEach(_tile => {
        let hb = hitbox[_tile.texture]
        if(hb) {
            connect(hb[0]+_tile.x,hb[1]+_tile.y, hb[2], hb[3])
        }
    })

    return colliders
}