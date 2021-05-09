const { RSA_PKCS1_PADDING } = require('constants')
var fs = require('fs')

const room_size = 20

var tile_list = require('./tiles')

var map = new Array(101).fill(0).map(()=>new Array(101).fill(0).map(()=>'#'))

function generate_map() {
    for(let y = 0;y<map.length;y++) {
        let map_row = map[y]
        for(let x = 0;x<map_row.length;x++) {
            let final = '#'

            if(((y+3)%(room_size/2)===0 && x%3===0)) {
                final = '|'
            }

            if(y%room_size===0) {
                final = '-'
            }

            if(x%room_size===0) {
                final = '0'
            }

            if(x%room_size===0 && (y+1)%room_size===0 && x!==0 && x!==map[y].length-1) {
                final = '#'
            }

            if(x===map[y].length-2 && (y+room_size)%(room_size*2)===0) {
                final = '#'
            }

            if(x===1&& y%(room_size*2)===0) {
                final = '#'
            }

            map[y][x] = final
        }
    }
}

function save_map() {
    fs.writeFileSync('./tiles.txt',map.map((x)=>x.join('')).join('\n'))
}

generate_map()
save_map()