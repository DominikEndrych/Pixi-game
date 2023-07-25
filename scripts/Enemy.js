class Enemy
{
    constructor(rect, text, speed)
    {
        this.rect = rect;       // Rectangle object
        this.speed = speed;     // Movement speed
        this.text = text;       // Inside text
    }

    move()
    {
        this.rect.y += this.speed;
        this.text.y += this.speed;
    }
}