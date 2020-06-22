const grid = document.getElementById("grid")
const gridSizeSlider = document.getElementById("gridSizeSlider") 
const gridCtx = grid.getContext("2d")

const colorOpen = "white"
const colorClosed = "#2D2D34"
const colorFull = "#499167"

let n = 20

let simulation = new MonteCarloSimulation(n, 30)

function squareSize(n) {
    return 600 / n
}

function drawSite(row, col, size, color) {
    let x = (col - 1) * size
    let y = (row - 1) * size

    gridCtx.beginPath()
    gridCtx.fillStyle = color
    gridCtx.fillRect(x, y, size, size)
    gridCtx.stroke()
}

function getRowCol(x, y) {
    var sqSize = squareSize(n)
    
    return {
        row: Math.floor(y / sqSize) + 1,
        col: Math.floor(x / sqSize) + 1
    }
}

grid.addEventListener("click", function (event) {
    var bounding = grid.getBoundingClientRect()

    var x = event.clientX - bounding.left
    var y = event.clientY - bounding.top

    var coords = getRowCol(x, y)

    percolation.open(coords.row, coords.col)
})

function clearGrid() {
    gridCtx.clearRect(0, 0, grid.width, grid.height)
}

gridSizeSlider.addEventListener("input", function () {
    n = this.value
    percolation = new Percolation(n)
})

function renderSites() {
    clearGrid()

    let sqSize = squareSize(n)

    simulation.push()
    let percolation = simulation.getCurrentPercolation()

    for (var row = 1; row <= n; row++) {
        for (var col = 1; col <= n; col++) {
            if (percolation.isFull(row, col)) {
                drawSite(row, col, sqSize, colorFull)
            } else if (percolation.isOpen(row, col)) {
                drawSite(row, col, sqSize, colorOpen)
            } else {
                drawSite(row, col, sqSize, colorClosed)
            }
        }
    }
}

setInterval(renderSites, 5)