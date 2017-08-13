// Standard Code Style -- https://github.com/standard/standard
// ESLint Config -- http://eslint.org/docs/user-guide/configuring

/* eslint-env browser */

/* global Vue */
/* global DefaultGraph */
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

    // The default graph
    aima.graph = new DefaultGraph()
    aima.graphProblem = new GraphProblemAStarSearch(
      aima.graph.nodes,
      aima.graph.edges,
      'A',
      'A',
      'O'
    )

    aima.options = new DefaultOptions()
    aima.options.nodes.next.fill = 'hsla(126, 100%, 69%, 1)'
    aima.options.edges.showCost = true

    aima.delay = 2000 // ms
    // It should color this node as "next" one
    aima.graphProblem.nodes[aima.graphProblem.initialKey].state = 'next'

    console.log('aStarSearch:aima', aima)

    return {
      aima: aima,
      timerId: null
    }
  },
  /**
   * @see https://vuejs.org/v2/api/#mounted
   */
  mounted: function () {
    var canvasOptions = {
      width: 600,
      height: 350
    }

    this.graphDrawAgent = new GraphDrawAgent(
      this.aima.graphProblem,
      'aStarSearchCanvas',
      this.aima.options,
      canvasOptions.height,
      canvasOptions.width
    )

    this.graphAgent = new GraphAgentAStarSearch(
      this.aima.graphProblem
    )
  },
  methods: {
    /**
     * It plays, pauses the animation
     */
    playOrPause: function () {
      if (this.timerId) {
        this.timerId = clearTimeout(this.timerId)
        return
      }

      if (this.aima.graphProblem.isSolved()) {
        this.reset()
      }
      var callback = function () {
        if (this.aima.graphProblem.isSolved()) {
          this.timerId = clearTimeout(this.timerId)
        } else {
          this.next()
          this.timerId = setTimeout(callback, this.aima.delay)
        }
      }.bind(this)

      this.timerId = setTimeout(callback, this.aima.delay)
    },
    /**
     * It renders next "frame" of visualization
     */
    next: function () {
      var nextNodeKey = this.aima.graphProblem.frontier[0]
      this.graphAgent.expand(nextNodeKey)
      this.graphDrawAgent.iterate()
    },
    /**
     * It resets the visualization state
     */
    reset: function () {
      this.aima.graphProblem.reset()
      this.aima.graphProblem.nodes[this.aima.graphProblem.initialKey].state = 'next'
      this.graphDrawAgent.iterate() // updates graph
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
