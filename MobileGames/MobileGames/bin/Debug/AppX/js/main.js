var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;

var canvas = document.getElementById("CanvasForTheGame");
var ctx = canvas.getContext("2d");
var width = 800;
var height = 600;

var player = {
    x: width / 3,
    y: height ,
    jumping: true,
    width: 64,
    height: 64,
    velX: 0,
    velY: 0
};
var friction = 0.8;
var gravity = 1.2;

//ALL OF THE VARIABLES FOR THE ANIMATIONS
var startTimeMS = 0;
var frameX = 0;
var frameXMax = 6;
var frameY = 0;
var frameYMax = 3;
var frame = 0;
var frameMax = 26;
var frameTimer = 0.05;
var frameTimeMax = 0.017;
var spriteWidth = 74;
var spriteHeight = 86;
var img = new Image();

var keys = [];
var isKeyPressed = false;

const GameStateEnum = {
    MAINMENU: 0,
    GAMEPLAY: 1,
    GAMEOVER: 3,
    PAUSE: 4
};
var gameState = GameStateEnum.MAINMENU;

window.addEventListener("load", function ()
{
    start();
    update();
});

function start() {
    canvas.width = width;
    canvas.height = height; 
    console.log(player.jumping);
    img.src = 'images/braidSpriteSheet.png';
}

function update()
{
    draw();

    switch (gameState) {
        case GameStateEnum.MAINMENU:
            {
                break;
            }
        case GameStateEnum.GAMEPLAY:
            {
                break;
            }
        case GameStateEnum.GAMEOVER:
            {
                break;
            }
        case GameStateEnum.PAUSE:
            {
                break;
            }
            
    }
    document.addEventListener("keydown", function (e) {
        keys[e.keyCode] = true;
        isKeyPressed = true;
    });

    document.addEventListener("keyup", function (e) {
        keys[e.keyCode] = false;
        isKeyPressed = false;
    });

    //JUMPING CONTROLS
    if (keys[32] && player.jumping == false) {
       
        player.velY -= 50 ;
        player.jumping = true;
    }

    player.velY += gravity;
    player.velX *= friction;
    player.velY *= friction;
    player.x += player.velX;
    player.y += player.velY;

    //sets the bottom boundary for the player
    if (player.y >= height - (player.height * 2)) {
        player.jumping = false;
        player.y = height - (player.height *2);
        player.velY = 0;
    }

    //SETS ANIMATION TO PLAY ONLY WHEN PLAYER IS NOT JUMPING
    if (player.jumping) {
        ctx.drawImage(img, spriteWidth * 2, spriteHeight * 1, spriteWidth, spriteHeight, player.x, player.y, player.width, player.height);

    } else
        animationFrame();
    ctx.drawImage(img, spriteWidth * frameX, spriteHeight * frameY, spriteWidth, spriteHeight, player.x, player.y, player.width, player.height);

    
    requestAnimationFrame(update);
}

function draw() {
    //CREATES BACKGROUND COLOUR
    ctx.clearRect(0, 20, width, height);
    ctx.fillStyle = "#00ff00";
    ctx.fillRect(0, 0, width, height);
    //DRAWS A LINE THAT THE PLAYER RUNS ON
    ctx.strokeStyle = "202830";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, 536);
    ctx.lineTo(width, 536);
    ctx.stroke();

}

//SETS UP PLAYER ANIMATION
function animationFrame() {
    var elapsed = (Date.now() - startTimeMS) / 1000;
    startTimeMS = Date.now();

    //only update frames when timer is below 0
    frameTimer = frameTimer - elapsed;
    if (frameTimer <= 0) {
        frameTimer = frameTimeMax;
        frameX++;
        if (frameX > frameXMax) {
            frameX = 0;
            frameY++;
            //end of row, move down to next row in sheet
            if (frameY > frameYMax) {
                frameY = 0;
            }
        }
        frame++;
        //reset frames to 0 in event that there are empty spaces on sprite sheet
        if (frame > frameMax) {
            frame = 0;
            frameX = 0;
            frameY = 0;
        }
    }
}

//SIMPLE COLLISION DETECTION
function colCheck(shapeA, shapeB) {
    // get the vectors to check against
    var vX = (shapeA.x + (shapeA.width / 2)) - (shapeB.x + (shapeB.width / 2)),
        vY = (shapeA.y + (shapeA.height / 2)) - (shapeB.y + (shapeB.height / 2)),
        // add the half widths and half heights of the objects
        hWidths = (shapeA.width / 2) + (shapeB.width / 2),
        hHeights = (shapeA.height / 2) + (shapeB.height / 2),
        colDir = null;

    // if the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
    if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
        // figures out on which side we are colliding (top, bottom, left, or right)
        var oX = hWidths - Math.abs(vX),
            oY = hHeights - Math.abs(vY);
        if (oX >= oY) {
            if (vY > 0) {
                colDir = "t";
                shapeA.y += oY;
            } else {
                colDir = "b";
                shapeA.y -= oY;
            }
        } else {
            if (vX > 0) {
                colDir = "l";
                shapeA.x += oX;
            } else {
                colDir = "r";
                shapeA.x -= oX;
            }
        }
    }
    return colDir;
}

