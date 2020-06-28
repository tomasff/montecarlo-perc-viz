const grid = document.getElementById("grid")
const gridCtx = grid.getContext("2d")

const gridSizeInput = document.getElementById("gridSize") 
const trialsInput = document.getElementById("trials")

const toggleSimulationBtn = document.getElementById("#toggleSimulation")

const graphMargin = {top: 30, right: 30, bottom: 30, left:30},
      graphWidth = 600 - graphMargin.left - graphMargin.right,
      graphHeight = 600 - graphMargin.top - graphMargin.bottom,
      graph = d3.select("#graph")
                .append("svg")
                .attr("width", graphWidth + graphMargin.left + graphMargin.right)
                .attr("height", graphHeight + graphMargin.top + graphMargin.bottom)
            .append("g")
            .attr("transform", "translate(" + graphMargin.left + ", " + graphMargin.top + ")")
    
const xAxis = d3.scaleLinear()
                .range([0, graphWidth])
                .domain([0, 1])

const yAxis = d3.scaleLinear()
                .range([graphHeight, 0])
                .domain([0, 1])

const line = d3.line()
               .x(d => xAxis(d[0]))
               .y(d => yAxis(d[1]))
               .curve(d3.curveBundle.beta(1))

const colorOpen = "white"
const colorClosed = "#2D2D34"
const colorFull = "#499167"
               
let gridSize = 30
let trials = 30
               
let simulationRunning = false
let simulation

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

function toggleSimulation() {
    simulation = new MonteCarloSimulation(gridSize, trials)

    simulationRunning = !simulationRunning
    pushSimulation()
}

function pushSimulation() {
    clearGrid()

    let sqSize = 600 / gridSize

    simulation.push()
    let percolation = simulation.getCurrentPercolation()

    for (var row = 1; row <= gridSize; row++) {
        for (var col = 1; col <= gridSize; col++) {
            if (percolation.isFull(row, col)) {
                drawSite(row, col, sqSize, colorFull)
            } else if (percolation.isOpen(row, col)) {
                drawSite(row, col, sqSize, colorOpen)
            } else {
                drawSite(row, col, sqSize, colorClosed)
            }
        }
    }

    const data = simulation.getPercolationProbs()
    graph.select("#line").attr("d", line(data))

    if (simulationRunning) {
        requestAnimationFrame(pushSimulation)
    }
}

graph.append("g")
     .attr("transform", "translate(0," + graphHeight + ")")
     .call(d3.axisBottom(xAxis))

graph.append("g")
     .attr("transform", "translate(0," + graphHeight + ")")
     .call(d3.axisBottom(xAxis))

graph.append("g")
     .call(d3.axisLeft(yAxis))

graph.append("path")
     .datum([])
     .attr("id", "line")
     .attr("fill", "none")
     .attr("stroke", "#2D2D34")
     .attr("stroke-width", 2.5)
     .attr("d", line)

gridSizeInput.addEventListener("input", function () {
    gridSize = this.value
})

trialsInput.addEventListener("input", function () {
    trials = this.value
})