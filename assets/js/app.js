const grid = document.getElementById("grid")
const gridCtx = grid.getContext("2d")

const gridSizeSlider = document.getElementById("gridSizeSlider") 
const simulationSpeedSlider = document.getElementById("simulationSpeedSlider")
const trialsSlider = document.getElementById("trialsSlider")

const colorOpen = "white"
const colorClosed = "#2D2D34"
const colorFull = "#499167"

let n = 30
let simulationSpeed = 1
let trials = 40
let prob = 0.01

let simulation = new MonteCarloSimulation(n, trials, prob)

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

function clearGrid() {
    gridCtx.clearRect(0, 0, grid.width, grid.height)
}

gridSizeSlider.addEventListener("input", function () {
    n = this.value
    simulation = new MonteCarloSimulation(n, trials, prob)
})

simulationSpeedSlider.addEventListener("input", function() {
    simulationSpeed = this.value

    // Reset interval and start again
    window.clearInterval(renderingInterval)
    renderingInterval = setInterval(renderSites, simulationSpeed)
})

trialsSlider.addEventListener("input", function () {
    trials = this.value
    simulation = new MonteCarloSimulation(n, trials, prob)
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

    if (simulation.hasFinished()) {
        console.log("(" + prob + ", " + (simulation.getNumberOfPercolations() / trials) + ")")
        prob += 0.01
        simulation = new MonteCarloSimulation(n, trials, prob)
    }
}

var renderingInterval = setInterval(renderSites, simulationSpeed)