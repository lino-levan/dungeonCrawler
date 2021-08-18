var SimplexNoise = require('simplex-noise'),
    simplex = new SimplexNoise(Math.random);
var fs = require('fs')

const map_size = 100

var tile_list = require('./tiles')

var map = new Array(map_size).fill(0).map(()=>new Array(map_size).fill(0).map(()=>'#'))

function generate_map() {
    for(let y = 0;y<map.length;y++) {
        let map_row = map[y]
        for(let x = 0;x<map_row.length;x++) {
            map[y][x] = simplex.noise2D(x/10,y/10) > 0.2 ? "0" : "#"
        }
    }

    for(let y = 0;y<map.length;y++) {
        let map_row = map[y]
        for(let x = 0;x<map_row.length;x++) {
            if(map[y][x] === "#") {
              let place_torch = true
              for(let dy = -4;dy<4;dy++) {
                  for(let dx = -4;dx<4;dx++) {
                    if(y+dy<0 || y+dy>map_size-1 || x+dx<0 || x+dx>map_size-1) {
                      continue
                    }

                    if(map[y+dy][x+dx] !== "#") {
                      place_torch = false
                      break
                    }
                  }
              }

              if(place_torch) {
                map[y][x] = "|"
              }
            }
        }
    }

    for(let i = 0;i<map_size;i++) {
      map[i][0] = "0"
      map[0][i] = "0"
      map[i][map_size-1] = "0"
      map[map_size-1][i] = "0"
    }
}

function save_map() {
    fs.writeFileSync('./tiles.txt',map.map((x)=>x.join('')).join('\n'))
}

generate_map()
save_map()
