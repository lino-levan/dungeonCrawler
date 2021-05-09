var textures = {}

var temp = {}

function register_texture(texture, id) {
    temp[id] = new Image()
    temp[id].src = texture
    temp[id].onload = ()=>{
        textures[id] = temp[id]
    }
}

register_texture('/assets/textures/tiles/background.png','background')
register_texture('/assets/textures/tiles/wooden_bridge.png','wooden_bridge')
register_texture('/assets/textures/tiles/wall.png','wall')
register_texture('/assets/textures/tiles/torch_1.png','torch_1')
register_texture('/assets/textures/tiles/torch_2.png','torch_2')
register_texture('/assets/textures/tiles/torch_3.png','torch_3')
register_texture('/assets/textures/tiles/torch_4.png','torch_4')

register_texture('/assets/textures/entities/player/walking_1.png','player_walking_1')
register_texture('/assets/textures/entities/player/walking_2.png','player_walking_2')

register_texture('/assets/textures/entities/slime/bounce_1.png','slime_bounce_1')
register_texture('/assets/textures/entities/slime/bounce_2.png','slime_bounce_2')

register_texture('/assets/textures/entities/mage/idle_1.png','mage_idle')
register_texture('/assets/textures/entities/mage/walking_1.png','mage_walking')

register_texture('/assets/textures/entities/bomb/bomb_1.png','bomb_1')
register_texture('/assets/textures/entities/bomb/bomb_2.png','bomb_2')
register_texture('/assets/textures/entities/bomb/bomb_3.png','bomb_3')

register_texture('/assets/textures/entities/explosion/explosion.png','explosion')
register_texture('/assets/textures/entities/tracker/tracker.png','tracker')

register_texture('/assets/textures/items/normal_sword.png','normal_sword')
register_texture('/assets/textures/items/bow.png','bow')
register_texture('/assets/textures/items/bomb.png','bomb')

register_texture('/assets/textures/entities/arrow/arrow.png','arrow')
register_texture('/assets/textures/entities/slash/slash.png','slash')

function draw_image(image, x, y, w, h) {
    if (!textures[image]) {
        return
    }

    kdraw.ctx.drawImage(textures[image], x, y, w, h)
}