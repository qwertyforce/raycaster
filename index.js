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
    radius: 10,
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

function draw_minimap(){
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0, 0, 120, 120);
    // for(let i=0;i<)
}

function rayCasting() {
    let rayAngle = player.angle - HALF_FOV;
    for(let rayCount = 0; rayCount < projection_width; rayCount++) {
        
        // Ray data
        let ray = {
            x: player.x,
            y: player.y
        }

        // Ray path incrementers
        let rayCos = Math.cos(degrees_to_radians(rayAngle)) / precision;
        let raySin = Math.sin(degrees_to_radians(rayAngle)) / precision;
        
        // Wall finder
        let wall = 0;
        while(wall == 0) {
            ray.x += rayCos;
            ray.y += raySin;
            wall = game_map[Math.floor(ray.y)][Math.floor(ray.x)];
        }

        // Pythagoras theorem
        let distance = Math.sqrt(Math.pow(player.x - ray.x, 2) + Math.pow(player.y - ray.y, 2));

        // Fish eye fix
        distance = distance * Math.cos(degrees_to_radians(rayAngle - player.angle));

        // Wall height
        let wallHeight = Math.floor(projection_half_height / distance);

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
        let playerCos = Math.cos(degrees_to_radians(player.angle)) * player.speed.movement;
        let playerSin = Math.sin(degrees_to_radians(player.angle)) * player.speed.movement;
        let newX = player.x + playerCos;
        let newY = player.y + playerSin;
        let checkX = Math.floor(newX + playerCos * player.radius);
        let checkY = Math.floor(newY + playerSin * player.radius);

        // Collision detection
        if(game_map[checkY][Math.floor(player.x)] == 0) {
            player.y = newY;
        }
        if(game_map[Math.floor(player.y)][checkX] == 0) {
            player.x = newX;
        } 

    }
    if(s_pressed) {
        let playerCos = Math.cos(degrees_to_radians(player.angle)) * player.speed.movement;
        let playerSin = Math.sin(degrees_to_radians(player.angle)) * player.speed.movement;
        let newX = player.x - playerCos;
        let newY = player.y - playerSin;
        let checkX = Math.floor(newX - playerCos * player.radius);
        let checkY = Math.floor(newY - playerSin * player.radius);

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
}
window.requestAnimationFrame(game_loop);
