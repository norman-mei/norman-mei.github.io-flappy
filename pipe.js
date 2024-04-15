class Pipe {
    constructor(img) {
    this.img = img
    this.x = 500
    this.y = random(100,200)
    this.width = img.width
    this.height = img.height
    this.scroll = -1
    this.gap = random(80, 100)
    this.scored = false
    }
    update() {
        this.x += this.scroll
    }
    display() {
        image(this.img, this.x, this.y, this.width / 2, this.height)
        push()
        scale(1, -1)
        image(this.img, this.x, -this.y + this.gap, this.width / 2, this.height)
        pop()
    }
}
