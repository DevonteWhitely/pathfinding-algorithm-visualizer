import React, { Component } from 'react';
import './PathfindingVisualizer.css';
import Node from './Node';
import {dijkstra} from '../algorithms/dijkstra';
import {AStar} from '../algorithms/aStar';
import {dfs} from '../algorithms/DFS';
import {bfs} from '../algorithms/BFS';

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;

export default class PathfindingVisualizer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            grid: [],
            mouseIsPressed: false,
            wallPresent: false,
            isRunning: false,
        };
        this.clearWalls = this.clearWalls.bind(this);
        this.toggleIsRunning = this.toggleIsRunning.bind(this);
    }

    componentDidMount() {
        const grid = getInitialGrid();
        this.setState({grid});    
    }

    toggleIsRunning() {
        this.setState({isRunning: !this.state.isRunning});
    }

    handleMouseDown(row, col) {
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({grid: newGrid, mouseIsPressed: true});
        this.setState({wallPresent: true});
    }

    handleMouseEnter(row, col) {
        if (!this.state.mouseIsPressed) return;
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({grid: newGrid});
    }

    handleMouseUp() {
        this.setState({mouseIsPressed: false});
    }

    handleOutOfOrder() {
        alert("Sorry, this algorithm is still in production.");
    }

    clearWalls() {
          const newGrid = getInitialGrid();
          this.setState({grid: newGrid});
          this.setState({wallPresent: false});
    }

    visualize(algo) {
        if (!this.state.isRunning) {
          this.clearPath();
          this.toggleIsRunning();
          const {grid} = this.state;
          const startNode = grid[START_NODE_ROW][START_NODE_COL];
          const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
          let visitedNodesInOrder;
          switch (algo) {
            case 'Dijkstra':
              visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
              break;
            case 'AStar':
              visitedNodesInOrder = AStar(grid, startNode, finishNode);
              break;
            case 'BFS':
              visitedNodesInOrder = bfs(grid, startNode, finishNode);
              break;
            case 'DFS':
              visitedNodesInOrder = dfs(grid, startNode, finishNode);
              break;
            default:
              // should never get here
              break;
          }
          const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
          nodesInShortestPathOrder.push('end');
          this.animate(visitedNodesInOrder, nodesInShortestPathOrder);
        }
      }

    animate(visitedNodesInOrder, nodesInShortestPathOrder) {
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
          if (i === visitedNodesInOrder.length) {
            setTimeout(() => {
              this.animateShortestPath(nodesInShortestPathOrder);
            }, 8 * i);
            return;
          }
          setTimeout(() => {
            const node = visitedNodesInOrder[i];
            const nodeClassName = document.getElementById(
              `node-${node.row}-${node.col}`,
            ).className;
            if (
              nodeClassName !== 'node node-start' &&
              nodeClassName !== 'node node-finish'
            ) {
              document.getElementById(`node-${node.row}-${node.col}`).className =
                'node node-visited';
            }
          }, 8 * i);
        }
    }

    animateShortestPath(nodesInShortestPathOrder) {
        for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
          if (nodesInShortestPathOrder[i] === 'end') {
            setTimeout(() => {
              this.toggleIsRunning();
            }, i * 50);
          } else {
            setTimeout(() => {
              const node = nodesInShortestPathOrder[i];
              const nodeClassName = document.getElementById(
                `node-${node.row}-${node.col}`,
              ).className;
              if (
                nodeClassName !== 'node node-start' &&
                nodeClassName !== 'node node-finish'
              ) {
                document.getElementById(`node-${node.row}-${node.col}`).className =
                  'node node-shortest-path';
              }
            }, i * 40);
          }
        }
    }

    clearPath() {
        if (!this.state.isRunning) {
          const newGrid = this.state.grid.slice();
          for (const row of newGrid) {
            for (const node of row) {
              let nodeClassName = document.getElementById(
                `node-${node.row}-${node.col}`,
              ).className;
              if (
                nodeClassName !== 'node node-start' &&
                nodeClassName !== 'node node-finish' &&
                nodeClassName !== 'node node-wall'
              ) {
                document.getElementById(`node-${node.row}-${node.col}`).className =
                  'node';
                node.isVisited = false;
                node.distance = Infinity;
                node.distanceToFinishNode =
                  Math.abs(this.state.FINISH_NODE_ROW - node.row) +
                  Math.abs(this.state.FINISH_NODE_COL - node.col);
              }
              if (nodeClassName === 'node node-finish') {
                node.isVisited = false;
                node.distance = Infinity;
                node.distanceToFinishNode = 0;
              }
              if (nodeClassName === 'node node-start') {
                node.isVisited = false;
                node.distance = Infinity;
                node.distanceToFinishNode =
                  Math.abs(this.state.FINISH_NODE_ROW - node.row) +
                  Math.abs(this.state.FINISH_NODE_COL - node.col);
                node.isStart = true;
                node.isWall = false;
                node.previousNode = null;
                node.isNode = true;
              }
            }
          }
        }
    }

    render() {

        const {grid, mouseIsPressed} = this.state;

        return (
            <>
            <div>
                <div className="dropdown">
                    <button>Algorithms</button>
                    <div className="dropdown-content">
                        <button onClick={() => this.visualize('Dijkstra')}>Visualize Dijkstra</button>
                        <button id="out-of-order" onClick={() => this.handleOutOfOrder()}>Visualize A*</button>
                        <button id="out-of-order" onClick={() => this.handleOutOfOrder()}>Visualize BFS</button>
                        <button id="out-of-order" onClick={() => this.handleOutOfOrder()}>Visualize DFS</button>
                    </div>                
                </div>

                <button onClick={() => this.clearPath()}>Clear Path</button>
                <button onClick={() => this.clearWalls()}>Clear Walls</button>
            </div>

            <div className="grid">
                {grid.map((row, rowIdx) => {
                    return ( 
                    <div key={rowIdx}>
                        {row.map((node, nodeIdx) => {
                            const {row, col, isStart, isFinish, isWall} = node;
                            return (
                                <Node
                                key={nodeIdx}
                                row={row}
                                col={col}
                                isStart={isStart}
                                isFinish={isFinish}
                                isWall={isWall}
                                mouseIsPressed={mouseIsPressed}
                                onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                                onMouseEnter={(row, col) => 
                                    this.handleMouseEnter(row, col)
                                }
                                onMouseUp={() => this.handleMouseUp()}>
                                </Node>
                            );
                        })}
                    </div>
                    );
                })}
            </div>
            </>
        );
    }
}

const getInitialGrid = function() {
    const grid = [];
    for (let row = 0; row < 20; row++) {
        const currentRow = [];
        for (let col = 0; col < 50; col++) {
            currentRow.push(createNode(col, row));
            }
            grid.push(currentRow);
        }
        return grid;
};

const createNode = function(col, row) {
    return {
        col,
        row,
        isStart: row === 10 && col === 15,
        isFinish: row === 10 && col === 35,
        distance: Infinity,
        isVisited: false,
        isWall: false,
        previousNode: null,
    };
};

const getNewGridWithWallToggled = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
      ...node,
      isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid;
};

function getNodesInShortestPathOrder(finishNode) {
    const nodesInShortestPathOrder = [];
    let currentNode = finishNode;
    while (currentNode !== null) {
      nodesInShortestPathOrder.unshift(currentNode);
      currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
};