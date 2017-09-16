// Standard Code Style -- https://github.com/standard/standard
// ESLint Config -- http://eslint.org/docs/user-guide/configuring

/* eslint-env browser */

/* global Vue */
/* global GraphAStarSearch */
/* global GraphProblemAStarSearch */
/* global GraphAgentAStarSearch */
/* global DefaultOptions */
/* global GraphDrawAgent */

window.vmAStarSearch = new Vue({
  /**
   * The mount point
   */
  el: '#aStarSearchBox',
  /**
   * We should define our data here
   * @return {Object}
   */
  data: function () {
    // namespace
    var aima = {}

    // Graph's options
    aima.options = new DefaultOptions()
    aima.options.nodes.next.fill = 'hsla(126, 100%, 69%, 1)'
    aima.options.edges.showCost = true

    // Two.js' options
    aima.canvasOptions = {
      width: 600,
      height: 350
    }

    // values
    aima.state = {
      initialKey: 'A',
      goalKey: 'O',
      iterationsCount: 0,
      maxIterationsCount: Number.POSITIVE_INFINITY // should be precalculated
    }

    aima.graphProblem = {}

    return {
      aima: aima
    }
  },
  beforeMount: function () {
    this.aima.graphProblem = this.createGraphProblem()
    this.graphAgent = new GraphAgentAStarSearch(this.aima.graphProblem)

    // console.log('aima:aStarSearch', this.aima.state)
  },
  /**
   * @see https://vuejs.org/v2/api/#mounted
   */
  mounted: function () {
    this.graphDrawAgent = new GraphDrawAgent(
      this.aima.graphProblem, // it is solved graphProblem
      'aStarSearchCanvas',
      this.aima.options,
      this.aima.canvasOptions.height,
      this.aima.canvasOptions.width
    )

    this.reset()
  },
  methods: {
    createGraphProblem: function () {
      // The default graph
      var graph = new GraphAStarSearch()
      var graphProblem = new GraphProblemAStarSearch(
        graph.nodes,
        graph.edges,
        this.aima.state.initialKey,
        this.aima.state.initialKey,
        this.aima.state.goalKey
      )
      // It should color this node as "next" one
      graphProblem.nodes[graphProblem.initialKey].state = 'next'
      return graphProblem
    },
    /**
     * Renders some state of graphProblem
     * @param {Number} iterationsCount
     */
    render: function (iterationsCount) {
      this.aima.state.iterationsCount = iterationsCount

      this.aima.graphProblem.reset()
      this.graphAgent.solve(this.aima.state.iterationsCount)
      // It renders the graph
      this.graphDrawAgent.iterate()
    },
    /**
     * Resets a graphProblem
     */
    reset: function () {
      this.aima.graphProblem.reset()
      this.aima.graphProblem.initialKey = this.aima.state.initialKey
      this.aima.graphProblem.nextToExpand = this.aima.state.initialKey
      this.aima.graphProblem.goalKey = this.aima.state.goalKey

      this.aima.state.iterationsCount = 0
      this.aima.state.maxIterationsCount = this.graphAgent.solve()
      // We have to reset graphProblem because it is already solved in the line above
      this.aima.graphProblem.reset()
      // It renders the graph
      this.graphDrawAgent.iterate()
    },
    /**
     * @param {GraphProblem} graphProblem
     * @return {Array.<Object>}
     */
    unexploredNodes: function (graphProblem) {
      return GraphProblemAStarSearch.toArray(graphProblem.nodes).filter(function (node) {
        return node.state === 'unexplored'
      })
    },
    /**
     * @param {GraphProblem} graphProblem
     * @return {Array.<Object>}
     */
    frontierNodes: function (graphProblem) {
      return graphProblem.frontier.map(function (nodeKey) {
        return graphProblem.nodes[nodeKey]
      })
    },
    /**
     * @param {GraphProblem} graphProblem
     * @return {Array.<Object>}
     */
    exploredNodes: function (graphProblem) {
      return graphProblem.explored.map(function (nodeKey) {
        return graphProblem.nodes[nodeKey]
      })
    },
    /**
     * @param {GraphProblem} graphProblem
     * @return {Array.<Object>}
     */
    getPathNodes: function (graphProblem) {
      var currentKey = graphProblem.frontier[0]
      var node = graphProblem.nodes[currentKey]
      var stack = []
      while (node) {
        stack.push(node)
        var parentKey = node.parent
        node = graphProblem.nodes[parentKey]
      }
      return stack.reverse()
    },
    /**
     * @param {GraphProblem} graphProblem
     * @param {DefaultOptions} options
     * @param {GraphNode} node
     * @return {{backgroundColor: string}}
     */
    getNodeStyle: function (graphProblem, options, node) {
      return {
        backgroundColor: options.nodes[node.state].fill
      }
    }
  }
})
