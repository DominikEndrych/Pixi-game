const maxWidth = 64;
const minWidth = 32;
const minFontSize = 20;

const letters = ["A", "B", "C", "D", "E", "F", "G"]

function randomRange(min, max)
{
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function spawnEnemy(app, enemySpeed)
{
    // Randomize enemy width
    width = randomRange(minWidth, maxWidth);

    // Randomize enemy starting location
    leftBoundary = width;
    rightBoundary = app.renderer.width - width;
    xPos = randomRange(leftBoundary, rightBoundary);

    // Randomize letter
    var letter = letters[randomRange(0, letters.length-1)];     // Select letter
    const style = new PIXI.TextStyle({                          // Style
        fontSize: randomRange(minFontSize, width),
        fill: "black",
    });
    var txt = getText(width, xPos, letter, style);              // Get text object

    r = getRect(width, xPos);                                   // Get rectangle object

    const enemy = new Enemy(r, txt, enemySpeed);                // Create enemy object
    app.stage.addChild(r);                                      // Append rectangle 
    app.stage.addChild(txt);                                    // Append text
    return enemy;

}

function getRect(width, xPos)
{
    const rectangle = new PIXI.Graphics();
    rectangle.beginFill(0xb3b3b3);
    rectangle.drawRect(0, 0, width, width);
    rectangle.endFill();
    rectangle.x = xPos;
    rectangle.y = 0;
    return rectangle;
}

function getText(width, xPos, letter, style)
{
    const txt = new PIXI.Text(letter, style);       // Create text object

    // Center text in the rectangle
    txt.x = ((width/2) - (txt.width/2)) + xPos;     // X center
    txt.y = width/2 - txt.height/2;                 // Y center

    return txt;
}