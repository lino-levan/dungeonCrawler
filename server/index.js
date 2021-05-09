var fs = require('fs')
var express = require('express')
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var handle_entities = require('./handle_entities')
var handle_collisions = require('./handle_collisions')
var generate_colliders = require('./generate_colliders')
var tile_list = require('./tiles')

var players = {}

let line_length = fs.readFileSync('tiles.txt','utf-8').split('\n')[0].length

var tiles = fs.readFileSync('tiles.txt','utf-8').split('\n').join('').split('').map((tile, i)=>{
    let t = {x:i%line_length * 64, y: Math.floor(i/line_length) * 64}
    t.texture = tile_list[tile]
    return t
})

var colliders = generate_colliders(tiles)

var entities = []

app.use(express.static('../client'))

io.on('connection', (socket) => {
    socket.emit('tiles', tiles)

    socket.emit('collision', colliders)

    io.emit('entities', entities)

    socket.on('disconnect', ()=>{
        delete players[socket.id]
    })

    socket.on('players', (me)=>{
        players[socket.id] = me
        io.emit('players', players)

        handle_collisions(players, entities, io)
    })

    socket.on('spawn_entity', (entity)=>{
        entities.push(entity)
        console.log('spawned ',entity.type)
        socket.emit('entities', entities)
    })
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});

function loop() {
    let update = handle_entities(entities, colliders, players)

    if(Math.random()<0.01) {
        let items = ['bow', 'normal_sword', 'bomb']

        entities.push({type:'item',metadata:{name:items[Math.floor(Math.random()*items.length)]},x:64*(Math.floor(Math.random()*(line_length-2))+1), y:64*(Math.floor(Math.random()*38)+1)})
        update = true
    }

    if(Math.random()<0.01) {
        if(Math.random()<0.125) {
            entities.push({type:'mage',metadata:{velocity:{y:0},timer:0, facing:-1, health: 5},x:64*(Math.floor(Math.random()*(line_length-2))+1), y:64*(Math.floor(Math.random()*38)+1)})
        } else {
            entities.push({type:'slime',metadata:{velocity:{x:0, y:0},timer:0, facing:-1},x:64*(Math.floor(Math.random()*(line_length-2))+1), y:64*(Math.floor(Math.random()*38)+1)})
        }
        update = true
    }

    if(update) {
        io.emit('entities', entities)
    }

    setTimeout(loop, 1000/30)
}
loop()