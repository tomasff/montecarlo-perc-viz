const gridSizeInput = document.getElementById("gridSize") 
const trialsInput = document.getElementById("trials")
const startBtn = document.getElementById("start")
const stopBtn = document.getElementById("stop")

const graph = new GraphPlot("#graph")
let running = false
let grid, simulation

const colors = {
    open: "white",
    closed: "#2D2D34",
    full: "#499167"
}

startBtn.onclick = () => {
    let gridSize = gridSizeInput.value

    grid = new Grid("grid", gridSize)
    simulation = new MonteCarloSimulation(gridSize, trialsInput.value)

    running = true
    pushSimulation()
}

stopBtn.onclick = () => {
    running = false
}

function pushSimulation() {
    grid.clear()
    simulation.push()

    let percolation = simulation.getCurrentPercolation()

    for (var row = 1; row <= grid.size; row++) {
        for (var col = 1; col <= grid.size; col++) {
            if (percolation.isFull(row, col)) {
                grid.drawSite(row, col, colors.full)
            } else if (percolation.isOpen(row, col)) {
                grid.drawSite(row, col, colors.open)
            } else {
                grid.drawSite(row, col, colors.closed)
            }
        }
    }

    graph.update(simulation.getPercolationProbs())

    if (running) {
        requestAnimationFrame(pushSimulation)
    }
}