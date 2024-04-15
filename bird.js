class Bird {
    constructor(img, x, y) {
        this.img = img
        this.width = img.width
        this.height = img.height
        this.x = x
        this.y = y
        this.dy = -6
        this.gravity = 0.5
    }
    display() {
        image(this.img, this.x, this.y)
    }
    update() {
        this.dy += this.gravity;
        this.y += this.dy;
        if (this.y + this.height >= height / 1.74 - 16) {
            this.y = height / 1.74 - 16 - this.height;
            explosion.play();
            hurt.play();
            gameState = "done";
        } else {
            this.y = constrain(this.y, 0, height / 1.74 - 16 - this.height);
        }
    }
    jump() {
        this.dy = -5
    }
    reset(y) {
        this.y = y
        this.dy = 0
        this.gravity = 0.6
    }
    collides(pipe) {
        let collidesUpper = this.x + this.width > pipe.x &&
                            this.x < pipe.x + pipe.width &&
                            this.y < pipe.y - pipe.gap;
        let collidesLower = this.x + this.width > pipe.x &&
                            this.x < pipe.x + pipe.width &&
                            this.y + this.height > pipe.y;
        return collidesUpper || collidesLower;
    }
}
