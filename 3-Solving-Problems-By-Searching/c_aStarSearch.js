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
  el: '#aStarSearchBox',
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

    aima.graphAgent = new GraphAgentAStarSearch(aima.graphProblem)
    aima.options = new DefaultOptions()
    aima.options.nodes.next.fill = 'hsla(126, 100%, 69%, 1)'
    aima.options.edges.showCost = true

    aima.canvas = {
      width: 600,
      height: 350
    }

    aima.graphDrawAgent = new GraphDrawAgent(
      aima.graphProblem,
      'aStarSearchCanvas',
      aima.options,
      aima.canvas.height,
      aima.canvas.width
    )

    aima.delay = 2000 // ms

    // It should color this node as "next" one
    aima.graphProblem.nodes['A'].state = 'next'

    console.log('aStarSearch:aima', aima)

    return {
      aima: aima
    }
  },
  methods: {
    /**
     * It renders next "frame" of visualization
     */
    renderNext: function () {
      var aima = this.aima
      var nextNodeKey = aima.graphProblem.frontier[0]
      aima.graphAgent.expand(nextNodeKey)
      // TODO: GraphDrawAgent.iterate() or something like this
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
