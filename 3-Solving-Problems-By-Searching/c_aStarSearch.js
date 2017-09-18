// Standard Code Style -- https://github.com/standard/standard
// ESLint Config -- http://eslint.org/docs/user-guide/configuring

/* eslint-env browser */

/* global GraphAStarSearch */
/* global GraphProblemAStarSearch */
/* global GraphAgentAStarSearch */
/* global DefaultOptions */
/* global GraphDrawAgent */

function AStarSearchRenderer () {
  this.dom = {}
  this.dom.root = document.querySelector('#aStarSearchBox')
  this.dom.startNode = document.querySelector('#aStarSearchBox-startNode')
  this.dom.goalNode = document.querySelector('#aStarSearchBox-goalNode')
  this.dom.slider = document.querySelector('#aStarSearchBox-slider')
  this.dom.stepBackward = document.querySelector('#aStarSearchBox-stepBackward')
  this.dom.stepForward = document.querySelector('#aStarSearchBox-stepForward')
  this.dom.reset = document.querySelector('#aStarSearchBox-reset')

  // Graph's options
  this.options = new DefaultOptions()
  this.options.nodes.next.fill = 'hsla(126, 100%, 69%, 1)'
  this.options.edges.showCost = true

  // Two.js' options
  this.canvasOptions = {
    width: 600,
    height: 350
  }

  // defines initial state
  this.state = {
    initialKey: 'A',
    goalKey: 'O',
    iterationsCount: 0,
    maxIterationsCount: Number.POSITIVE_INFINITY // should be precalculated
  }

  this.initializeProblemAndAgents()
  this.attachEventListeners()
  this.reset()
  this.render()
}
AStarSearchRenderer.prototype.initializeProblemAndAgents = function () {
  this.graphProblem = this.createGraphProblem()
  this.graphAgent = new GraphAgentAStarSearch(this.graphProblem)
  this.graphDrawAgent = new GraphDrawAgent(
    this.graphProblem, // it is solved graphProblem
    'aStarSearchCanvas',
    this.options,
    this.canvasOptions.height,
    this.canvasOptions.width
  )
}
AStarSearchRenderer.prototype.createGraphProblem = function () {
  // The default graph
  var graph = new GraphAStarSearch()
  var graphProblem = new GraphProblemAStarSearch(
    graph.nodes,
    graph.edges,
    this.state.initialKey,
    this.state.initialKey,
    this.state.goalKey
  )
  // It should color this node as "next" one
  graphProblem.nodes[graphProblem.initialKey].state = 'next'
  return graphProblem
}
AStarSearchRenderer.prototype.attachEventListeners = function () {
  this.dom.startNode.addEventListener('change', this.onChangeStartNode.bind(this))
  this.dom.goalNode.addEventListener('change', this.onChangeGoalNode.bind(this))
  this.dom.slider.addEventListener('input', this.onInputSlider.bind(this))
  this.dom.stepBackward.addEventListener('click', this.onClickStepBackward.bind(this))
  this.dom.stepForward.addEventListener('click', this.onClickStepForward.bind(this))
  this.dom.reset.addEventListener('click', this.onClickReset.bind(this))
}
AStarSearchRenderer.prototype.onChangeStartNode = function () {
  var el = this.dom.startNode
  this.state.initialKey = el.options[el.selectedIndex].value
  this.reset()
  this.render()
}
AStarSearchRenderer.prototype.onChangeGoalNode = function () {
  var node = this.dom.goalNode
  this.state.goalKey = node.options[node.selectedIndex].value
  this.reset()
  this.render()
}
AStarSearchRenderer.prototype.onInputSlider = function () {
  var el = this.dom.slider
  this.state.iterationsCount = Number(el.value)
  this.render()
}
AStarSearchRenderer.prototype.onClickStepBackward = function () {
  this.state.iterationsCount = Math.max(this.state.iterationsCount - 1, 0)
  this.render()
}
AStarSearchRenderer.prototype.onClickStepForward = function () {
  this.state.iterationsCount = Math.min(this.state.iterationsCount + 1,
    this.state.maxIterationsCount)
  this.render()
}
AStarSearchRenderer.prototype.onClickReset = function () {
  this.reset()
  this.render()
}
/**
 * Resets a graphProblem
 */
AStarSearchRenderer.prototype.reset = function () {
  this.graphProblem.reset()
  this.graphProblem.initialKey = this.state.initialKey
  this.graphProblem.nextToExpand = this.state.initialKey
  this.graphProblem.goalKey = this.state.goalKey

  this.state.iterationsCount = 0
  this.state.maxIterationsCount = this.graphAgent.solve()
  // We have to reset graphProblem because it is already solved in the line above
  this.graphProblem.reset()
}
/**
 * Renders some state of graphProblem
 */
AStarSearchRenderer.prototype.render = function () {
  var helpers = AStarSearchRenderer.helpers
  var nodes = this.graphProblem.nodes
  var state = this.state

  // start's select options
  this.dom.startNode.innerHTML = ''
  helpers.forEach(nodes, function (node) {
    var isSelected = node.id === state.initialKey
    var elementOption = new Option(node.id, node.id, isSelected, isSelected)
    this.dom.startNode.appendChild(elementOption)
  }, this)

  // goal's select options
  this.dom.goalNode.innerHTML = ''
  helpers.forEach(nodes, function (node) {
    var isSelected = node.id === state.goalKey
    var elementOption = new Option(node.id, node.id, isSelected, isSelected)
    this.dom.goalNode.appendChild(elementOption)
  }, this)

  // slider
  this.dom.slider.max = this.state.maxIterationsCount
  this.dom.slider.value = this.state.iterationsCount

  // stepBackward
  this.dom.stepBackward.disabled = this.state.iterationsCount === 0
  // stepForward
  this.dom.stepForward.disabled = this.state.iterationsCount === this.state.maxIterationsCount

  this.graphProblem.reset()
  this.graphAgent.solve(this.state.iterationsCount)
  // It renders the graph (Two.js)
  this.graphDrawAgent.iterate()
}
AStarSearchRenderer.helpers = {
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
  },
  /**
   * @param {Array|Object} iterable
   * @param {Function} cb
   * @param {*} that
   */
  forEach: function (iterable, cb, that) {
    if (Array.isArray(iterable)) {
      Array.prototype.forEach.call(iterable, cb, that)
    } else {
      for (var key in iterable) {
        cb.call(that, iterable[key], key)
      }
    }
  }
}

new AStarSearchRenderer()
