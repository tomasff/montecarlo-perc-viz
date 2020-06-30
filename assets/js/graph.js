class GraphPlot {
    constructor(id) {
        this.margin = { top: 30, right: 30, bottom: 30, left: 30 }
        this.width = 600 - this.margin.left - this.margin.right
        this.height = 600 - this.margin.top - this.margin.bottom

        this.graph = d3.select(id)
                       .append("svg")
                       .attr("width", this.width + this.margin.left + this.margin.right)
                       .attr("height", this.height + this.margin.top + this.margin.bottom)
                       .append("g")
                       .attr("transform", "translate(" + this.margin.left + ", " + this.margin.top + ")")

        this.xAxis = d3.scaleLinear()
                       .range([0, this.width])
                       .domain([0, 1])

        this.yAxis = d3.scaleLinear()
                       .range([this.height, 0])
                       .domain([0, 1])

        this.line = d3.line()
                      .x(d => this.xAxis(d[0]))
                      .y(d => this.yAxis(d[1]))
                      .curve(d3.curveBundle.beta(1))

        this.graph.append("g")
                  .attr("transform", "translate(0," + this.height + ")")
                  .call(d3.axisBottom(this.xAxis))

        this.graph.append("g")
                  .call(d3.axisLeft(this.yAxis))

        this.graph.append("path")
                  .datum([])
                  .attr("id", "line")
                  .attr("fill", "none")
                  .attr("stroke", "#2D2D34")
                  .attr("stroke-width", 2.5)
                  .attr("d", this.line)
    }

    update(data) {
        this.graph.select("#line").attr("d", this.line(data))
    }
}

