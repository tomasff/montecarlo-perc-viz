/**
 * Weighted quick union find
 * 
 * Implementation from {@link https://algs4.cs.princeton.edu/15uf/WeightedQuickUnionUF.java.html}
 * rewritten in JavaScript
 */
class WeightedQuickUnionUF {
    constructor(n) {
        this.count = n
        this.parentTree = []
        this.size = []

        for (var i = 0; i < this.count; i++) {
            this.parentTree[i] = i
            this.size[i] = 1
        }
    }

    validate(index) {
        if (index < 0 || index >= this.parentTree.length) {
            throw 'Invalid index'
        }
    }

    count() {
        return this.count
    }

    find(index) {
        this.validate(index)
        while(index != this.parentTree[index]) {
            index = this.parentTree[index]
        }

        return index
    }

    union(p, q) {
        var rootP = this.find(p)
        var rootQ = this.find(q)

        if (rootP == rootQ) {
            return
        }

        if (this.size[rootP] < this.size[rootQ]) {
            this.parentTree[rootP] = rootQ
            this.size[rootQ] += this.size[rootP]
        } else {
            this.parentTree[rootQ] = rootP
            this.size[rootP] += this.size[rootQ]
        }

        this.count--
    }
}

/**
 * Percolation simulation using the weighted quick union find graph
 */
class Percolation {
    constructor(n) {
        if (n <= 0) {
            throw "n must be greater than zero!"
        }

        this.n = n
        this.graphSize = n * n + 2
        this.noOfOpenSites = 0
        this.sitesStatus = []
        this.graph = new WeightedQuickUnionUF(this.graphSize)

        // Initialize sites status
        for (var i = 0; i < this.graphSize; i++) {
            this.sitesStatus[i] = false
        }
    }

    findId(row, col) {
        return (row - 1) * n + col
    }

    validate(row, col) {
        if (row <= 0 || col <= 0 || row > n || col > n) {
            throw "Invalid site coordinates"
        }
    }

    open(row, col) {
        this.validate(row, col)
        var id = this.findId(row, col)
        if (!this.sitesStatus[id]) {
            this.noOfOpenSites++
            this.sitesStatus[id] = true
        }

        if (row > 1) {
            this.unionIfOpen(id, row - 1, col);
        }

        if (row < n) {
            this.unionIfOpen(id, row + 1, col);
        }

        if (col > 1) {
            this.unionIfOpen(id, row, col - 1);
        }

        if (col < n) {
            this.unionIfOpen(id, row, col + 1);
        }

        if (row == 1) {
            this.graph.union(id, 0);
        }

        if (row == n) {
            this.graph.union(id, this.graphSize - 1);
        }
    }

    unionIfOpen(currentId, row, col) {
        var targetId = this.findId(row, col)

        if (this.isOpen(row, col)) {
            this.graph.union(targetId, currentId)
        }
    }

    isOpen(row, col) {
        this.validate(row, col)
        return this.sitesStatus[this.findId(row, col)]
    }

    isFull(row, col) {
        this.validate(row, col)
        return this.graph.find(0) == this.graph.find(this.findId(row, col))
    }

    noOfOpenSites() {
        return this.noOfOpenSites
    }

    percolates() {
        return this.graph.find(0) == this.graph.find(this.graphSize - 1)
    }
}

class MonteCarloSimulation {
    constructor(gridSize, trials) {
        if (gridSize <= 0 || trials <= 0) {
            throw "The number of trials and grid size must be greater than 0!"
        }

        this.trials = trials
        this.pStarEstimate = []
    }

}