var canvas = kdraw.canvas
var ctx = kdraw.ctx

ctx.imageSmoothingEnabled = false;

var _world = new world()

var _gui = new gui()

var socket = io();

socket.on('players', (players)=>{
    _world.players = players
})

socket.on('tiles', (t)=>{
    let max_x = 0
    let max_y = 0

    _world.tiles = t.map((_tile)=>{
        max_x = max_x > _tile.x? max_x: _tile.x
        max_y = max_y > _tile.y? max_y: _tile.y

        return new tile(_tile.texture, _tile.x, _tile.y)
    })

    _world.camera.max = {x:max_x-640+64, y:max_y-640+64}
})

socket.on('collision', (c)=>{
    _world.collision = c
})

socket.on('entities', (i)=>{
    _world.entities = i.map((_entity)=>{
        return new entity(_entity.type, _entity.x, _entity.y, _entity.metadata)
    })
})

socket.on('collect_item', (_item)=> {
    _world.me.collect_item(_item.metadata.name)
})

socket.on('die', ()=> {
    _world.me.inventory.forEach((item)=>{
        _world.spawn({type:'item',metadata:{name:item}, x:_world.me.x, y:_world.me.y})
    })
    _world.me = new player(64, 64)
})

var keys = {};
keyPressed = function(){keys[keyCode] = true;};
keyReleased = function(){keys[keyCode] = false;};

function draw() {

    _world.draw()

    _gui.setInventory(_world.me.inventory)
    _gui.draw()

    let me = _world.me

    if(keys[68] && keys[65]) {
        me.velocity.x = 0
    } else if(keys[68]) {
        me.velocity.x = me.stats.speed
    } else if(keys[65]) {
        me.velocity.x = -me.stats.speed
    } else {
        me.velocity.x = 0
    }

    if(keys[67]) {
        let first = _world.me.inventory[0]

        if(first) {
            _world.me.inventory.shift()
            _world.me.inventory.push(first)
        }

        keys[67] = false
    }

    if(keys[81]) {
        let first = _world.me.inventory[0]

        if(first) {
            _world.me.inventory.shift()
            _world.spawn({type:'item',metadata:{name:first},x:_world.me.x, y:_world.me.y-64})
        }

        keys[81] = false
    }

    if(keys[87] && me.can_jump) {
        me.velocity.y-=30

        me.can_jump = false
    }

    if(keys[32]) {
        if(items[me.inventory[0]] && items[me.inventory[0]].on_use && _world.me.cooldown>items[me.inventory[0]].cooldown) {
            items[me.inventory[0]].on_use()
            _world.me.cooldown = 0
        }
    }

    if(!_world.players[socket.id] || _world.players[socket.id].animation_state !== me.animation_state || _world.players[socket.id].facing !== me.facing || _world.players[socket.id].inventory !== me.inventory || _world.players[socket.id].x !== me.x || _world.players[socket.id].y !== me.y) {
        socket.emit('players', {x:me.x, y:me.y, facing:me.facing, animation_state: me.animation_state, inventory: [me.inventory[0]]})
    }
}
