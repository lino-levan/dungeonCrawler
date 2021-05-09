var intersection = require('./intersection.js')

module.exports = (players, entities, io) => {
    let update = false


    for(id in players) {
        let player = players[id]

        entities.forEach((entity, i) => {
            if(intersection(player.x, player.y, 64, 64, entity.x, entity.y, 64, 64)) {
                if(entity.type === 'item') {
                    console.log("collected ", entity.metadata.name)

                    io.to(id).emit('collect_item', entity)
                    entities.splice(i, 1)
                    update = true
                } else if(entity.type === 'arrow') {
                    if(id !== entity.metadata.shot_from) {
                        io.to(id).emit('die')
                        entities.splice(i, 1)
                        update = true
                    }
                } else if(entity.type === 'slash') {
                    if(id !== entity.metadata.shot_from) {
                        io.to(id).emit('die')
                        entities.splice(i, 1)
                        update = true
                    }
                } else if(entity.type === 'slime') {
                    io.to(id).emit('die')
                    update = true
                } else if(entity.type === 'explosion') {
                    io.to(id).emit('die')
                    update = true
                } else if(entity.type === 'tracker') {
                    io.to(id).emit('die')
                    update = true
                } 
            }
        }) 
    }

    entities.forEach((entity1, i) => {
        entities.forEach((entity2, j) => {
            if(i!==j) {
                if(intersection(entity1.x,entity1.y, 64, 64, entity2.x, entity2.y, 64, 64)) {
                    if(entity1.type === 'arrow') {
                        if(entity2.type === 'arrow') {
                            entities.splice(i, 1)
                            entities.splice(j-1, 1)
                            update = true
                        }

                        if(entity2.type === 'slash') {
                            entities.splice(i, 1)
                            entities.splice(j-1, 1)
                            update = true
                        }

                        if(entity2.type === 'tracker') {
                            entities.splice(i, 1)
                            entities.splice(j-1, 1)
                            update = true
                        }
                    }

                    if(entity1.type === 'slash') {
                        if(entity2.type === 'arrow') {
                            entities.splice(i, 1)
                            entities.splice(j-1, 1)
                            update = true
                        }

                        if(entity2.type === 'slash') {
                            entities.splice(i, 1)
                            entities.splice(j-1, 1)
                            update = true
                        }


                        if(entity2.type === 'tracker') {
                            entities.splice(i, 1)
                            entities.splice(j-1, 1)
                            update = true
                        }
                    }

                    if(entity1.type === 'slime') {
                        if(entity2.type === 'arrow') {
                            entities.splice(i, 1)
                            entities.splice(j-1, 1)
                            update = true
                        }

                        if(entity2.type === 'slash') {
                            entities.splice(i, 1)
                            entities.splice(j-1, 1)
                            update = true
                        }
                    }

                    if(entity1.type === 'mage') {
                        if(entity2.type === 'arrow') {
                            entities[i].metadata.health--
                            entities.splice(j, 1)
                            update = true
                        }

                        if(entity2.type === 'slash') {
                            entities[i].metadata.health--
                            entities.splice(j, 1)
                            update = true
                        }
                    }

                    if(entity1.type === 'tracker') {
                        if(entity2.type === 'arrow') {
                            entities.splice(i, 1)
                            entities.splice(j-1, 1)
                            update = true
                        }

                        if(entity2.type === 'slash') {
                            entities.splice(i, 1)
                            entities.splice(j-1, 1)
                            update = true
                        }
                    }

                    if(entity1.type === 'explosion') {
                        if(['arrow', 'slash', 'slime', 'tracker', 'mage'].includes(entity2.type)) {
                            entities.splice(j, 1)
                            update = true
                        }
                    }
               }
            }    
        }) 
    })

    if(update) {
        io.emit('entities', entities)
    }
}