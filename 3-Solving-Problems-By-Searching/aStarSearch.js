
// Standard Code Style -- https://github.com/standard/standard
// ESLint Config -- http://eslint.org/docs/user-guide/configuring

/* eslint-env browser */
/* global GraphProblem */
/* global GraphAgent */

// Code for A Star Search

// TODO: Should we use ES5 syntax for support old browsers?
class GraphProblemAStarSearch extends GraphProblem {
  /**
   * @see https://github.com/nervgh/astar-algorithm
   * @param {Object} nodes
   * @param {Object} edges
   * @param {String} initialKey
   * @param {String} nextToExpand
   * @param {String} goalKey
   */
  constructor (nodes, edges, initialKey, nextToExpand, goalKey) {
    super(nodes, edges, initialKey, nextToExpand)
    this.goalKey = goalKey
  }
  /**
   * It should check: is a node is the goal?
   * @param {String} nodeKey
   * @return {Boolean}
   */
  isGoal (nodeKey) {
    return this.goalKey === nodeKey
  }
  /**
   * g(x). It should return the cost of path between two nodes
   * @param {String} nodeKeyA
   * @param {String} nodeKeyB
   * @return {Number}
   */
  distance (nodeKeyA, nodeKeyB) {
    for (const [keyA, keyB, cost] of this.edges) {
      if (GraphProblemAStarSearch.isEqualNodeKeyPair(nodeKeyA, nodeKeyB, keyA, keyB)) {
        return cost
      }
    }
    return Number.POSITIVE_INFINITY
  }
  /**
   * h(x). It should return the cost of path from a node to the goal
   * @param {String} nodeKey
   * @param {String} [goalKey]
   * @return {Number}
   */
  estimate (nodeKey, goalKey = this.goalKey) {
    let nodeA = this.nodes[nodeKey]
    let nodeB = this.nodes[goalKey]
    let point1 = [nodeA.x, nodeA.y]
    let point2 = [nodeB.x, nodeB.y]
    return GraphProblemAStarSearch.euclideanDistance(point1, point2)
  }
  /**
   * @param {String} nodeKey
   * @return {Array.<GraphNode>}
   */
  getSuccessors (nodeKey) {
    return this.getAdjacent(nodeKey).map(key => this.nodes[key])
  }
  /**
   * Resets problem
   */
  reset () {
    super.reset()
    for (const node of GraphProblemAStarSearch.toArray(this.nodes)) {
      node.totalCost = 0
    }
  }
  /**
   * @return {Boolean}
   */
  isSolved () {
    return this.explored.indexOf(this.goalKey) !== -1
  }
  /**
   * @param {String} nodeKey
   * @return {Boolean}
   */
  isExplored (nodeKey) {
    return this.explored.indexOf(nodeKey) !== -1
  }
  /**
   * @param {String} nodeKeyA1
   * @param {String} nodeKeyB1
   * @param {String} nodeKeyA2
   * @param {String} nodeKeyB2
   * @return {Boolean}
   */
  static isEqualNodeKeyPair (nodeKeyA1, nodeKeyB1, nodeKeyA2, nodeKeyB2) {
    return (nodeKeyA1 === nodeKeyA2 && nodeKeyB1 === nodeKeyB2) ||
           (nodeKeyA1 === nodeKeyB2 && nodeKeyB1 === nodeKeyA2)
  }
  /**
   * @param {Array.<Number>} point1
   * @param {Array.<Number>} point2
   * @return {Number}
   */
  static euclideanDistance (point1, point2) {
    return Math.sqrt(Math.pow(point1[0] - point2[0], 2) + Math.pow(point1[1] - point2[1], 2))
  }
  /**
   * Turns an object to an array of objects
   * @param {Object} obj
   * @return {Array.<Object>}
   */
  static toArray (obj) {
    let stack = []
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        stack.push(obj[key])
      }
    }
    return stack
  }
}

// TODO: Should we use ES5 syntax for support old browsers?
class GraphAgentAStarSearch extends GraphAgent {
  /**
   * The function that expands a node from the graph
   * @see https://github.com/nervgh/astar-algorithm
   * @param {String} nodeKey
   */
  expand (nodeKey) {
    const parentNode = this.problem.nodes[nodeKey]

    this.problem.removeFromFrontier(parentNode.id)
    this.problem.addToExplored(parentNode.id)

    if (this.problem.isGoal(parentNode.id)) {
      // TODO: parentNode.state = 'goal'
      return
    }

    for (const successorNode of this.problem.getSuccessors(parentNode.id)) {
      if (this.problem.isExplored(successorNode.id)) {
        continue
      }

      this.problem.addToFrontier(successorNode.id)

      successorNode.depth = parentNode.depth + 1
      successorNode.parent = parentNode.id

      // The distance from start to a successor
      const tentativeGScore = parentNode.cost + this.problem.distance(parentNode.id, successorNode.id)

      // This is not a better path
      if (tentativeGScore >= successorNode.cost) {
        continue
      }

      // This path is the best until now. We should save it.
      successorNode.cost = tentativeGScore
      successorNode.totalCost = tentativeGScore + this.problem.estimate(successorNode.id)
    }

    // We should prioritize the queue items
    this.problem.frontier.sort((keyA, keyB) => {
      return this.problem.nodes[keyA].totalCost - this.problem.nodes[keyB].totalCost
    })
  }
}
