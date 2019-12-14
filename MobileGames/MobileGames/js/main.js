var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;

var gameplayAudio = new Audio('assets/Boss.wav')
var gameOverAudio = new Audio('assets/rwp_character_youlldobetternexttime_edited.wav')
var canvas = document.getElementById("CanvasForTheGame");
var ctx = canvas.getContext("2d");
var width = 800;
var height = 600;
var score = 0;
var highScore = 0;
var paused = false;


//DECLARATION OF DIFFERENT GAME OBJECTS IN THE GAME
var cloudImage = new Image();
var clouds = [];
var sunImage = new Image();
var obstacle = {
    x: width -100,
    y: height - 112 ,
    width:48,
    height: 48,
    velX: 0
};
var obstacleImage = new Image();
var coins = [];
var coinImage = new Image();
var playerImage = new Image();
var player = {
    x: width / 3,
    y: height,
    jumping: true,
    width: 64,
    height: 64,   
    velX: 0,
    velY: 0
};
//Animation variables
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

//other declarations
var friction = 0.8;
var gravity = 1.5;
var keys = [];
var isKeyPressed = false;

//DECLARTION OF DIFFERENT GAMESTATES
const GameStateEnum = {
    MAINMENU: 0,
    GAMEPLAY: 1,
    GAMEOVER: 3,
    PAUSE: 4
};
var gameState = GameStateEnum.MAINMENU;

document.addEventListener("keydown", function (e) {
    keys[e.keyCode] = true;
    isKeyPressed = true;
});

document.addEventListener("keyup", function (e) {
    keys[e.keyCode] = false;
    isKeyPressed = false;
});

window.addEventListener("load", function ()
{
    start();
    if (!paused) {
        update();
    } 
});

//START FUNCTION- TO BE CALLED ON STARTING THE GAME
function start() {
    canvas.width = width;
    canvas.height = height; 

    clouds.push({
        x: 800,
        y: 120,
        width: 200,
        height: 200
    });
    clouds.push({
        x: 400,
        y: 90,
        width: 200,
        height: 200
    });
    clouds.push({
        x: 1050,
        y: 70,
        width: 200,
        height: 200
    });

    
    
    playerImage.src = 'images/braidSpriteSheet.png';
    obstacleImage.src = 'images/rock_type_planet.png';
    cloudImage.src = 'images/clouds.png';
    sunImage.src = 'images/sun_shiny.png';
}

function update()
{
    switch (gameState) {
        case GameStateEnum.MAINMENU:
            {
                mainmenuDraw();                
                break;
            }
        case GameStateEnum.GAMEPLAY:
            {                
                gameplayAudio.play();
                gamePlaydraw();
                gameplayUpdate();                  
                break;
            }
        case GameStateEnum.GAMEOVER:
            {
                gameplayAudio.pause();                
                highScore += score;
                gameOverDraw();
                score = 0;
                break;
            }
        case GameStateEnum.PAUSE:
            {                  
                break;
            }
    }

    //KEY CONTROLS
    if (keys[32] ) {
        spaceKeyPressed();
    }
    if (keys[80] && gameState == GameStateEnum.GAMEPLAY) {
        gameState = GameStateEnum.PAUSE;
        togglePause();
    } else if (keys[80] && gameState == GameStateEnum.PAUSE) {
        gameState = GameStateEnum.GAMEPLAY;
        togglePause();
    }
    if (keys[39]) {
        // right arrow
        if (player.x < (canvas.width - player.width - 20))
            player.velX++;
    }
    if (keys[37]) {
        // left arrow
        if (player.x > player.width)
            player.velX--;
    }

    if (keys[82] && gameState == GameStateEnum.GAMEOVER) {
        gameState = GameStateEnum.GAMEPLAY;
        location.reload();
    }

    requestAnimationFrame(update);
}
function gameplayUpdate() {
    
    player.velY += gravity;
    player.velX *= friction;
    player.velY *= friction;
    player.x += player.velX;
    player.y += player.velY;

    //sets the bottom boundary for the player
    if (player.y >= height - (player.height * 2)) {
        player.jumping = false;
        player.y = height - (player.height * 2);
        player.velY = 0;
    }

    //makes the obstacle move faster up to a certain speed
    if (score <= 15) {
        obstacle.x -= (4 + score); 
    }else obstacle.x -=18
    if (obstacle.x < 0) {
        obstacle.x = width + Math.random() * 200;
        score++;
    }

    // check if collide with players
    
    var dir = colCheck(player, obstacle);
    if (dir === "l" || dir === "r" || (dir === "t" || dir === "b")) {
        gameState = GameStateEnum.GAMEOVER;
        gameOverAudio.play();
    }
}

function gamePlaydraw() {
    //CREATES BACKGROUND COLOUR
    ctx.clearRect(0, 20, width, height);
    ctx.fillStyle = "#0000ff";
    ctx.fillRect(0, 0, width, height);
    //DRAWS A LINE THAT THE PLAYER RUNS ON
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, 536);
    ctx.lineTo(width, 536);
    ctx.stroke();
    //DRAWS THE SCORE AND INFO
    ctx.fillStyle = '#ffffff'
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Score: ' + score, 100, 575);    
    ctx.fillText('Press \'p\' To Pause', width - 100, 575);

    //DRAWS GAME OBJECTS
    ctx.drawImage(sunImage, 100, 50, 100, 100);
    ctx.drawImage(obstacleImage, obstacle.x, obstacle.y,obstacle.width, obstacle.height);
   
    //SETS ANIMATION TO PLAY ONLY WHEN PLAYER IS NOT JUMPING
    if (player.jumping) {
        ctx.drawImage(playerImage, spriteWidth * 2, spriteHeight * 1, spriteWidth, spriteHeight, player.x, player.y, player.width, player.height);

    } else
        animationFrame();
    ctx.drawImage(playerImage, spriteWidth * frameX, spriteHeight * frameY, spriteWidth, spriteHeight, player.x, player.y, player.width, player.height);
    

    for (var i = 0; i < clouds.length; i++) {
        // show the clouds on canvas
        ctx.rect(clouds[i].x, clouds[i].y, clouds[i].width, clouds[i].height);
        ctx.drawImage(cloudImage, clouds[i].x, clouds[i].y, clouds[i].width, clouds[i].height);
        clouds[i].x = clouds[i].x - 0.75;

        if (clouds[i].x < -200) {
            clouds[i].x = 900;
        }
    }
}

//function to draw everything in the main menu
function mainmenuDraw() {
    ctx.fillStyle = "#ff0000";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "#ffff00";
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Jumping Runnerman - The Game!', width / 2, 200);
    ctx.fillText('Press Space Bar to Start!', width / 2, height / 2);
    ctx.clearRect(200, (height /2)+20, width /2, 175);
    ctx.font = '32px Arial';
    ctx.fillStyle = '#ff0000'
    ctx.fillText('Space - Jump', width / 2, height / 2 + 50);
    ctx.fillText('Left Arrow - Left', width / 2, height / 2 + 100);
    ctx.fillText('Right Arrow - Right', width / 2, height / 2 + 150);
}

function gameOverDraw() {
    ctx.fillStyle = "#ff0000";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "#ffff00";
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over!\n', width / 2, height / 2);
    ctx.fillText('Your Score Was: \n' + highScore , width / 2, height / 2 + 50);
    ctx.fillText('Press \'r\' to Retry', width / 2, height / 2 + 100);
}

function pausedDraw() {
    ctx.fillText('PAUSED', width / 2, height / 2);
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

//function that can be called when a key is pressed 
function spaceKeyPressed() {

    if (gameState == GameStateEnum.MAINMENU) {
        gameState = GameStateEnum.GAMEPLAY;
    }

    if (gameState == GameStateEnum.GAMEPLAY && player.jumping == false) {
        player.velY -= 55;
        player.jumping = true;        
    }

}

function togglePause() {
    if (!paused) {        
        paused = true;
    } else if (paused); {   
        pausedDraw();
        paused = false;
    }
}
