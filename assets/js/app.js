const grid = document.getElementById("grid")
const gridCtx = grid.getContext("2d")

const gridSizeSlider = document.getElementById("gridSizeSlider") 
const simulationSpeedSlider = document.getElementById("simulationSpeedSlider")
const trialsSlider = document.getElementById("trialsSlider")

const graphMargin = {top: 30, right: 30, bottom: 30, left:30},
      width = 600 - graphMargin.left - graphMargin.right,
      height = 600 - graphMargin.top - graphMargin.bottom,
      graph = d3.select("#graph")
                .append("svg")
                .attr("width", width + graphMargin.left + graphMargin.right)
                .attr("height", height + graphMargin.top + graphMargin.bottom)
            .append("g")
            .attr("transform", "translate(" + graphMargin.left + ", " + graphMargin.top + ")")
    
const x = d3.scaleLinear()
            .range([0, width])
            .domain([0, 1])

graph.append("g")
     .attr("transform", "translate(0," + height + ")")
     .call(d3.axisBottom(x))

const y = d3.scaleLinear()
            .range([height, 0])
            .domain([0, 1])

graph.append("g")
     .call(d3.axisLeft(y))

const line = d3.line()
               .x(d => x(d[0]))
               .y(d => y(d[1]))
               .curve(d3.curveBundle.beta(1))

graph.append("path")
      .datum([])
      .attr("id", "line")
      .attr("fill", "none")
      .attr("stroke", "#2D2D34")
      .attr("stroke-width", 2.5)
      .attr("d", line)

const colorOpen = "white"
const colorClosed = "#2D2D34"
const colorFull = "#499167"

let n = 30
let simulationSpeed = 1
let trials = 60

let simulation = new MonteCarloSimulation(n, trials)

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
    simulation = new MonteCarloSimulation(n, trials)
})

simulationSpeedSlider.addEventListener("input", function() {
    simulationSpeed = this.value

    // Reset interval and start again
    window.clearInterval(renderingInterval)
    renderingInterval = setInterval(pushSimulation, simulationSpeed)
})

trialsSlider.addEventListener("input", function () {
    trials = this.value
    simulation = new MonteCarloSimulation(n, trials)
})

function pushSimulation() {
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

    const data = simulation.getPercolationProbs()
    graph.select("#line").attr("d", line(data))
}

var renderingInterval = setInterval(pushSimulation, simulationSpeed)