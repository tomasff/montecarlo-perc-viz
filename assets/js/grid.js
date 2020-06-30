class Grid {
    constructor(id, size) {
        this.grid = document.getElementById(id)
        this.ctx = this.grid.getContext("2d")

        this.size = size
        this.siteSize = this.grid.width / this.size
    }

    drawSite(row, col, color) {
        let x = (col - 1) * this.siteSize
        let y = (row - 1) * this.siteSize

        this.ctx.beginPath()
        this.ctx.fillStyle = color
        this.ctx.fillRect(x, y, this.siteSize, this.siteSize)
        this.ctx.stroke()
    }

    clear() {
        this.ctx.clearRect(0, 0, this.grid.width, this.grid.height)
    }
}