// Standard Code Style -- https://github.com/standard/standard
// ESLint Config -- http://eslint.org/docs/user-guide/configuring

/* eslint-env browser */

/* global Vue */
/* global DefaultGraph */
/* global GraphProblem */
/* global GraphAgent */
/* global DefaultOptions */
/* global GraphDrawAgent */

new Vue({
  el: '#aStarSearchBox',
  data: function () {
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

    // It should color this node as "next" one
    aima.graphProblem.nodes['A'].state = 'next'

    console.log('aStarSearch:aima', aima)

    return {
      aima: aima
    }
  },
  methods: {
    /**
     * @param {GraphProblem} graphProblem
     * @return {Array.<Object>}
     */
    unexploredNodes: function (graphProblem) {
      return toArray(graphProblem.nodes)
        .filter(function (node) {
          return node.state === 'unexplored'
        })
        .sort(function (nodeA, nodeB) {
          return compareStrings(nodeA.text, nodeB.text)
        })
    },
    /**
     * @param {GraphProblem} graphProblem
     * @return {Array.<Object>}
     */
    frontierNodes: function (graphProblem) {
      return toArray(graphProblem.nodes)
        .filter(function (node) {
          return node.state === 'frontier' || node.state === 'next'
        })
        .sort(function (nodeA, nodeB) {
          return compareStrings(nodeA.text, nodeB.text)
        })
    },
    /**
     * @param {GraphProblem} graphProblem
     * @return {Array.<Object>}
     */
    exploredNodes: function (graphProblem) {
      return toArray(graphProblem.nodes)
        .filter(function (node) {
          return node.state === 'explored'
        })
        .sort(function (nodeA, nodeB) {
          return compareStrings(nodeA.text, nodeB.text)
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

/**
 * Turns an object to an array of objects
 * @param {Object} obj
 * @return {Array.<Object>}
 */
function toArray (obj) {
  var stack = []
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      stack.push(obj[key])
    }
  }
  return stack
}
/**
 * @see https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#Description
 * @param {String} str1
 * @param {String} str2
 * @return {Number}
 */
function compareStrings (str1, str2) {
  if (str1 <= str2) {
    return -1
  }
  if (str1 > str2) {
    return 1
  }
  return 0
}
