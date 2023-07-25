const GameStates = {
    Running: "running",
    Stopped: "stopped"
}

const gameSpeeds = [0.1, 0.17, 0.23, 0.3]      // Enemy speeds

// Variables
const app = getStage();                 // The main stage
var gameState = GameStates.Stopped;     // Current game state
let score = 0;                          // Current score
const winScore = 50;

var spawningRate = 800;                 // Enemy spawn rate in miliseconds
var spawnInterval = undefined;          // Interval object to spawn enemies

var enemies = []                        // Array to store enemies
let speed = gameSpeeds[0];              // Current enemy speed

var bottomCollider = undefined;         // Bottom screen collider
var isKeyPressed = false;               // Is some key currently pressed

const winMessageStyle = new PIXI.TextStyle({
    fontFamily: "Arial",
    fontSize: 64,
    fill: "#00cc00",
    stroke: "#99ebff",
    strokeThickness: 4,
    dropShadow: true,
    dropShadowColor: "#000000",
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
  });
const winMessage = new PIXI.Text("You Win!", winMessageStyle);
const looseMessage = new PIXI.Text("Game Over!", winMessageStyle);

function getStage()
{
    var options = 
    {
        width: 800,         // default: 800
        height: 600,        // default: 600
        antialias: true,    // default: false
        transparent: false, // default: false
        resolution: 1,      // default: 1
        backgroundColor: 0xf2f2f2,   // Background color
    }

    // Create a Pixi Application and store it in variable
    var app = new PIXI.Application(options);
    return app;
}

function setupGame(app)
{
    // Add the canvas that Pixi automatically created to the HTML document
    document.body.appendChild(app.view);

    // Create bottom collider
    const rectangle = new PIXI.Graphics();
    rectangle.beginFill(0xff1a1a, 0.2);
    rectangle.drawRect(0, 0, app.renderer.width, 64);
    rectangle.endFill();
    rectangle.x = 0;
    rectangle.y = app.renderer.height - 20;

    // Add collider
    bottomCollider = rectangle;
    app.stage.addChild(bottomCollider);

    // Setup win message
    winMessage.position.x = (app.renderer.width / 2) - (winMessage.width / 2);
    winMessage.position.y = (app.renderer.height / 2) - (winMessage.height / 2);
    
    // Setup game over message
    looseMessage.position.x = (app.renderer.width / 2) - (looseMessage.width / 2);
    looseMessage.position.y = (app.renderer.height / 2) - (looseMessage.height / 2);

    // Add event listeners
    window.addEventListener("keydown", keyDown);    // Button press event
    window.addEventListener("keyup", keyUp);    // Button release event
}

function keyDown(e)
{
    
    if(gameState == GameStates.Running && !isKeyPressed)
    {
        isKeyPressed = true;
        var success = removeKeyEnemies(e.key);
        if(success)
        {
            score++;
        }
        else
        {
            score -=2;
            if(score < 0) score = 0;    // Score can't be less then 0
        }
        document.getElementById("score").innerHTML = "Score: " + score;     // Update score
    
        // Stop the game if score is more then winScore
        if(score >= winScore)
        {
            stopGame(true);
            return;
        }
    
        // Adjust speed 
        if(score >= winScore/1.2)
        {
            speed = gameSpeeds[3];
        } 
        else if (score >= winScore/2) 
        {
            speed = gameSpeeds[2];
        }
        else if (score >= winScore/6) 
        {
            speed = gameSpeeds[1];
        }
        else speed = gameSpeeds[0];
    }
}

function keyUp(e)
{
    isKeyPressed = false;
}

function changeGameState()
{
    if(gameState == GameStates.Stopped)
    {
        startGame();
    }
    else
    {
        stopGame();
    }
}

function startGame()
{
    gameState = GameStates.Running;
    app.stage.removeChild(winMessage);
    app.stage.removeChild(looseMessage);
    document.getElementById("startBtn").innerHTML = "Stop";     // Change button text
    score = 0;                                                  // Reset score
    speed = gameSpeeds[0];
    document.getElementById("score").innerHTML = "Score: 0";
    spawnInterval = setInterval(
        function(){
            enemies.push(spawnEnemy(app, speed));               // Spawn new enemy and store to array
        }, spawningRate);
    gameLoop();                                                 // Start the game loop
    
}

function stopGame(wasWin)
{
    gameState = GameStates.Stopped;
    document.getElementById("startBtn").innerHTML = "Start";    // Change button text
    clearInterval(spawnInterval);
    removeAllEnemies();

    // Did the player win?
    if(wasWin)
    {
        app.stage.addChild(winMessage);     // Display win message
    }

}

function removeAllEnemies()
{
    for(let i = 0; i < enemies.length; i++)
    {
        app.stage.removeChild(enemies[i].rect);     // Remove rectangle
        app.stage.removeChild(enemies[i].text);     // Remove text
    }
    enemies = [];
}

function removeKeyEnemies(key)
{
    var removed = 0;
    for(let i = 0; i < enemies.length; i++)
    {
        if(enemies[i].text.text.toLowerCase() == key.toLowerCase())
        {
            app.stage.removeChild(enemies[i].rect);     // Remove rectangle
            app.stage.removeChild(enemies[i].text);     // Remove text
            enemies.splice(i,1)
            i--;
            removed++;
        }
    }
    if(removed >= 2)
    {
        return true;
    }
    else return false;
}

function gameLoop()
{
    if(gameState == GameStates.Running)
    {
        // Movement and colisions
        for(let i = 0; i < enemies.length; i++)
        {
            // Move enemy
            enemies[i].move();
            
            // Test collision with bottom collider
            if (hitTestRectangle(enemies[i].rect, bottomCollider)) 
            {
                stopGame();     // Stop the game
                app.stage.addChild(looseMessage);     // Display game over message
            }
        }
        requestAnimationFrame(gameLoop);
    }
}


// Load stage in the main window
window.onload = setupGame(app);

