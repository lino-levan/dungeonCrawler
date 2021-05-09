const items = {
    bow: {
        cooldown: 30,
        on_use: ()=>{
            _world.spawn({type:'arrow', metadata:{rotation: Math.atan2(-10, 15 * _world.me.facing) * 180/Math.PI, velocity:{y:-10}, facing:_world.me.facing, shot_from: socket.id}, x:_world.me.x, y:_world.me.y})
        }
    },
    normal_sword: {
        cooldown: 10,
        on_use: ()=>{
            _world.spawn({type:'slash', metadata:{facing:_world.me.facing, shot_from: socket.id}, x:_world.me.x, y:_world.me.y})
        }
    },
    bomb: {
        cooldown: 5,
        on_use: ()=>{
            _world.spawn({type:'bomb', metadata:{velocity:{y:0}, shot_from: socket.id}, x:_world.me.x, y:_world.me.y})
            _world.me.inventory.shift()
        }
    }
}