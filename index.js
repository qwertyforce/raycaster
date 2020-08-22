// Calculated data
const scale=1
const height=720
const width=1280
const projection_height=height / scale
const projection_width=width / scale
const projection_half_height=projection_height/2
const FOV=60;
const precision=90
const player = {
    x: 2, y: 2, angle: 0,
    radius: 1,
    speed: {
        movement: 0.1,
        rotation: 2.5
    }
}
const game_map=  [[2,2,2,2,2,2,2,2,2,2],
            [2,0,0,0,0,0,0,0,0,2],
            [2,0,0,0,0,0,0,0,0,2],
            [2,0,0,2,2,0,2,0,0,2],
            [2,0,0,2,0,0,2,0,0,2],
            [2,0,0,2,0,0,2,0,0,2],
            [2,0,0,2,0,2,2,0,0,2],
            [2,0,0,0,0,0,0,0,0,2],
            [2,0,0,0,0,0,0,0,0,2],
            [2,2,2,2,2,2,2,2,2,2]]

const HALF_FOV = FOV / 2;
const angle_increment = FOV / projection_width;

const canvas = document.createElement('canvas');
canvas.width = width;
canvas.height = height;
canvas.style.border = "1px solid black";
document.body.appendChild(canvas);


const ctx = canvas.getContext("2d");
// screenContext.scale(scale, scale);



function degrees_to_radians(degree) {
    return (degree * Math.PI) / 180;
}

function draw_line(x1, y1, x2, y2, cssColor) {
    ctx.strokeStyle = cssColor;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function draw_minimap() {
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0, 0, 120, 120);

    for (let i = 0; i < game_map.length; i++) {
        for (let j = 0; j < game_map[0].length; j++) {
            // console.log(i,j)
            if (game_map[i][j] === 2) {
                ctx.fillStyle = 'rgb(255,255,255)';
                ctx.fillRect(i * 12, j * 12, 10, 10);
            }
        }
    }
    ctx.fillStyle = 'rgb(255,0,0)';
    ctx.fillRect(Math.floor(player.y * 12), Math.floor(player.x * 12), 10, 10);
    const player_x = Math.floor(player.x * 12) + (player.radius / 2 * 12)
    const player_y = Math.floor(player.y * 12) + (player.radius / 2 * 12)
    ctx.moveTo(player_y, player_x);
    const r = 100
    ctx.strokeStyle = "#FF0000";
    ctx.lineTo(player_y + r * Math.cos(degrees_to_radians(90-player.angle)), player_x + r * Math.sin(degrees_to_radians(90-player.angle)));
    ctx.stroke();

}

function rayCasting() {
    let rayAngle = player.angle - HALF_FOV;
    for(let rayCount = 0; rayCount < projection_width; rayCount++) {
        
        // Ray data
        const ray = {
            x: player.x,
            y: player.y
        }

        // Ray path incrementers
        const rayCos = Math.cos(degrees_to_radians(rayAngle)) / precision;
        const raySin = Math.sin(degrees_to_radians(rayAngle)) / precision;
        
        // Wall finder
        let wall = 0;
        while(wall === 0) {
            ray.x += rayCos;
            ray.y += raySin;
            wall = game_map[Math.floor(ray.y)][Math.floor(ray.x)];
        }

        // Pythagoras theorem
        let distance = Math.sqrt(Math.pow(player.x - ray.x, 2) + Math.pow(player.y - ray.y, 2));

        // Fish eye fix
        distance = distance * Math.cos(degrees_to_radians(rayAngle - player.angle));

        // Wall height
        const wallHeight = Math.floor(projection_half_height / distance);

        draw_line(rayCount, 0, rayCount, projection_half_height - wallHeight, "black");
        draw_line(rayCount, projection_half_height + wallHeight, rayCount, projection_height, "rgb(95, 87, 79)");

        // Increment
        rayAngle += angle_increment;
    }
}

 
function clearScreen() {
    ctx.clearRect(0, 0, projection_width, projection_height);
}

 
function movePlayer() {
    if(w_pressed) {
        const playerCos = Math.cos(degrees_to_radians(player.angle)) * player.speed.movement;
        const playerSin = Math.sin(degrees_to_radians(player.angle)) * player.speed.movement;
        const newX = player.x + playerCos;
        const newY = player.y + playerSin;
        const checkX = Math.floor(newX + playerCos * player.radius);
        const checkY = Math.floor(newY + playerSin * player.radius);

        // Collision detection
        if(game_map[checkY][Math.floor(player.x)] === 0) {
            player.y = newY;
        }
        if(game_map[Math.floor(player.y)][checkX] === 0) {
            player.x = newX;
        } 

    }
    if(s_pressed) {
        const playerCos = Math.cos(degrees_to_radians(player.angle)) * player.speed.movement;
        const playerSin = Math.sin(degrees_to_radians(player.angle)) * player.speed.movement;
        const newX = player.x - playerCos;
        const newY = player.y - playerSin;
        const checkX = Math.floor(newX - playerCos * player.radius);
        const checkY = Math.floor(newY - playerSin * player.radius);

        // Collision detection
        if(game_map[checkY][Math.floor(player.x)] == 0) {
            player.y = newY;
        }
        if(game_map[Math.floor(player.y)][checkX] == 0) {
            player.x = newX;
        } 
    }
    if(a_pressed) {
        player.angle -= player.speed.rotation;
        player.angle %= 360;
    }
    if(d_pressed) {
        player.angle += player.speed.rotation;
        player.angle %= 360;
    } 
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
let w_pressed;
let a_pressed;
let s_pressed;
let d_pressed;
function keyDownHandler(e) {
    switch (e.code) {
        case "KeyW":
            w_pressed = true;
            break;
        case "KeyA":
            a_pressed = true;
            break;
        case "KeyS":
            s_pressed = true;
            break;
        case "KeyD":
            d_pressed = true;
            break;
    }
}

function keyUpHandler(e) {
    switch (e.code) {
        case "KeyW":
            w_pressed = false;
            break;
        case "KeyA":
            a_pressed = false;
            break;
        case "KeyS":
            s_pressed = false;
            break;
        case "KeyD":
            d_pressed = false;
            break;
    }
}
 
function game_loop() {
    window.requestAnimationFrame(game_loop);
        clearScreen();
        movePlayer();
        rayCasting();
        draw_minimap()
        console.log(player.y,player.x)
}
window.requestAnimationFrame(game_loop);
