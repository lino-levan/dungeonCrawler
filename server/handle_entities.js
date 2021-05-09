var handle_colliders = require('./handle_colliders')

function dist(x1,y1,x2,y2) {
    return Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2,2))
}

function closest_player(x, y, players) {
    if(players.length>0) {
        let closest = players[0]

        players.forEach((player)=>{
            if(dist(player.x, player.y, x, y)<dist(closest.x, closest.y, x, y)) {
                closest = player
            }
        })

        return closest
    } else {
        return
    }
}

module.exports = (entities, colliders, players)=>{
    let update = false

    const dt = 30/1000

    entities.forEach((entity,index) => {
        if(entity.type === 'arrow') {
            entity.metadata.timer = entity.metadata.timer+1 || 0

            if(entity.metadata.timer === 50) {
                entities.splice(index, 1)
            }

            entity.x+=64 * 8 * entity.metadata.facing * dt

            entity.y+= entity.metadata.velocity.y

            entity.metadata.velocity.y += 20 * dt

            entity.metadata.rotation = Math.atan2(entity.metadata.velocity.y, 15 * entity.metadata.facing) * 180/Math.PI


            update = true
        } else if(entity.type === 'slash') {
            entity.metadata.timer = entity.metadata.timer+1 || 0

            if(entity.metadata.timer === 5) {
                entities.splice(index, 1)
            }
            entity.x+= 600 * entity.metadata.facing * dt

            update = true
        } else if(entity.type === 'slime') {
            entity.metadata.velocity.y += 10 * dt

            entity.y+= entity.metadata.velocity.y

            let velocity_x = entity.metadata.facing * 150 * dt

            entity.x+= velocity_x

            let col = handle_colliders(entity.x, entity.y, {x:velocity_x, y:entity.metadata.velocity.y}, colliders)

            entity.x = col.x
            entity.y = col.y
            entity.metadata.velocity.y = col.velocity.y

            entity.metadata.timer = entity.metadata.timer+1 || 0

            if(entity.metadata.timer%100 === 0 ) {

                entity.metadata.velocity.y = -4 * (Math.floor(Math.random()*3)+1)

                entity.metadata.facing = Math.floor(Math.random()*3)-1
            }

            if(entity.metadata.timer === 1000) {
                entities.splice(index, 1)
            }

            update = true
        } else if(entity.type === 'mage') {
            entity.metadata.velocity.y += 10 * dt

            entity.y+= entity.metadata.velocity.y

            entity.metadata.velocity.x = entity.metadata.facing * 150 * dt

            entity.x+= entity.metadata.velocity.x

            let col = handle_colliders(entity.x, entity.y, {x:entity.metadata.velocity.x, y:entity.metadata.velocity.y}, colliders)

            entity.x = col.x
            entity.y = col.y
            entity.metadata.velocity.y = col.velocity.y
            entity.metadata.velocity.x = col.velocity.x

            entity.metadata.timer = entity.metadata.timer+1 || 0

            if(entity.metadata.timer%100 === 0 ) {

                entity.metadata.velocity.y = -4 * (Math.floor(Math.random()*3)+1)

                entity.metadata.facing = Math.floor(Math.random()*3)-1

                if(Math.random()<0.5) {
                    entities.unshift({type:'tracker', metadata:{timer:0},x:entity.x, y: entity.y})
                }
            }

            if(entity.metadata.timer === 10000 || entity.metadata.health === 0) {
                entities.splice(index, 1)
            }

            update = true
        } else if(entity.type === 'skeleton') {
            entity.metadata.velocity.y += 10 * dt

            entity.y+= entity.metadata.velocity.y

            entity.metadata.velocity.x = entity.metadata.velocity.x || 0

            entity.x+= entity.metadata.velocity.x

            let col = handle_colliders(entity.x, entity.y, {x:entity.metadata.velocity.x, y:entity.metadata.velocity.y}, colliders)

            entity.x = col.x
            entity.y = col.y
            entity.metadata.velocity.y = col.velocity.y
            entity.metadata.velocity.x = col.velocity.x

            entity.metadata.timer = entity.metadata.timer+1 || 0

            let player = closest_player(entity.x, entity.y, Object.values(players))

            if(player && Math.abs(player.x - entity.x) < 64 * 10) {
                if(Math.abs(player.x - entity.x) < 64 * 6) {
                    if(player.x>entity.x) {
                        entity.metadata.facing = -1
                    } else {
                        entity.metadata.facing = 1
                    }

                    entity.metadata.velocity.x = entity.metadata.facing * 150 * dt
                } else if(Math.abs(player.x - entity.x) < 64 * 7) {
                    if(player.x>entity.x) {
                        entity.metadata.facing = 1
                    } else {
                        entity.metadata.facing = -1
                    }

                    entity.metadata.velocity.x = 0
                } else if(Math.abs(player.x - entity.x) < 64 * 10) {
                    if(player.x>entity.x) {
                        entity.metadata.facing = 1
                    } else {
                        entity.metadata.facing = -1
                    }

                    entity.metadata.velocity.x = entity.metadata.facing * 150 * dt
                }
            }


            if(entity.metadata.timer%100 === 0 ) {

                // entity.metadata.facing = Math.floor(Math.random()*3)-1
                // entity.metadata.facing = entity.metadata.facing === 0? 1 : entity.metadata.facing

                if(Math.random()<0.5) {
                    entities.unshift({type:'arrow', metadata:{rotation: Math.atan2(-10, 15 * entity.metadata.facing) * 180/Math.PI, velocity:{y:-10}, facing:entity.metadata.facing, shot_from: entity}, x:entity.x, y:entity.y})
                }
            }

            if(entity.metadata.timer === 10000 || entity.metadata.health === 0) {
                entities.splice(index, 1)
            }

            update = true
        } else if(entity.type === 'bomb') {
            entity.metadata.velocity.y += 10 * dt

            entity.y+= entity.metadata.velocity.y


            let col = handle_colliders(entity.x, entity.y, {x:0, y:entity.metadata.velocity.y}, colliders)

            entity.x = col.x
            entity.y = col.y
            entity.metadata.velocity.y = col.velocity.y

            entity.metadata.timer = entity.metadata.timer+1 || 0

            if(entity.metadata.timer === 30) {
                entities.splice(index, 1)

                for(let x = 0;x<7;x++) {
                    for(let y = 0;y<7;y++) {
                        entities.push({type:'explosion',metadata:{timer:0},x:entity.x + (64 * (x-3)), y:entity.y + (64 * (y-3))})
                    }
                }
            }

            update = true
        } else if(entity.type === 'explosion') {
            entity.metadata.timer = entity.metadata.timer+1 || 0

            if(entity.metadata.timer === 5) {
                entities.splice(index, 1)

                update = true

            }
        } else if(entity.type === 'tracker') {
            entity.metadata.timer = entity.metadata.timer+1 || 0

            let player = closest_player(entity.x, entity.y, Object.values(players))

            if(player) {
                entity.x += (entity.x-player.x)!==0?((entity.x-player.x)>0?-6:6):0
                entity.y += (entity.y-player.y)!==0?((entity.y-player.y)>0?-6:6):0
            }

            if(entity.metadata.timer === 60) {
                entities.splice(index, 1)

                update = true

            }
        }
    });

    return update
}
