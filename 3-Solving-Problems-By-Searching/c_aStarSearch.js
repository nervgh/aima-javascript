// Standard Code Style -- https://github.com/standard/standard
// ESLint Config -- http://eslint.org/docs/user-guide/configuring

/* eslint-env browser */

/* global Vue */
/* global DefaultGraph */
/* global precomputedCosts */
/* global GraphProblem */
/* global GraphAgent */
/* global DefaultOptions */
/* global GraphDrawAgent */

new Vue({
  el: '#aStarSearchBox',
  mounted: function () {
    // namespace
    var aima = {}

    // The default graph
    aima.graph = new DefaultGraph()
    aima.graphProblem = new GraphProblem(
      aima.graph.nodes,
      aima.graph.edges,
      'A',
      'A'
    )
    // Precompute costs of all nodes from the initial node
    aima.costMap = precomputedCosts()

    aima.graphAgent = new GraphAgent(aima.graphProblem, 'a*-search')
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

    this.aima = aima

    console.log('aStarSearch', aima)
  },
  computed: {
    // TODO: need implement
    priorityQueue: function () {
      var aima = this.aima
      return // {Array}
    },
    // TODO: need implement
    exploredNodes: function () {
      var aima = this.aima
      return // {Array}
    }
  }

})
