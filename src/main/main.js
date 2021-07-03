import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'

import 'bootstrap/dist/css/bootstrap.min.css'
import Slider from 'react-input-slider'
import { DropdownMultiple, Dropdown } from 'reactjs-dropdown-component'
import Modal from 'react-modal'
import SideBar from './components/sideBar/sideBar'
import './main.css'

import Node from './components/node/node'
import astar from './components/aStar/a_star'
import bfs from './components/bfs/bfs'
import dfs from './components/dfs/dfs'
import dijkstra from './components/dijkstra/dijkstra'

import simpleMaze from './components/simpleMaze/simpleMaze'
import recursiveDivision from './components/recursiveDivision/recursiveDivision'
import recursiveBacktracking from './components/recursiveBacktracking/recursiveBacktracking'
import randomized_Prims from './components/randomized_Prims/randomized_Prims'

import page1 from './fontsAndImg/page1.png'
import page2 from './fontsAndImg/page2.png'
import gifAlgo from './fontsAndImg/gifAlgo.gif'
import gifWalls from './fontsAndImg/gifWalls.gif'
import page61 from './fontsAndImg/page61.png'
import page62 from './fontsAndImg/page62.png'

let rows = 25
let cols = 61

let dragStart = false
let dragEnd = false
let dragWalls = false

let start_x = Math.ceil(rows / 2)
let start_y = Math.ceil(cols / 6)
let end_x = rows - Math.ceil(rows / 2)
let end_y = cols - Math.ceil(cols / 6)

let fp = undefined
let vn = undefined

// let isDone = false;

let speedFactor = 1

let detailsContent = [
  {
    label: 'Algorithm',
    content: '',
  },
  {
    label: 'Breadth-First Search',
    content: 'Breadth-First Search',
  },
  {
    label: 'Depth-First Search',
    content: 'Depth-First Search',
  },
  {
    label: "Dijkstra's Algorithm",
    content: "Dijkstra's Algorithm",
  },
  {
    label: 'A-Star Search',
    content: 'A* Search',
  },
]

function Main() {
  // const [state, setState] = useState({ x: 0.3 });

  const [contentIndex, setContentIndex] = useState(0)
  const [isDone, setIsDone] = useState([1, 0, 0, 0, 0, 0])

  const [grid, setGrid] = useState([])
  useEffect(() => {
    initializeGrid()
  }, [])

  const initializeGrid = () => {
    const grid = new Array(rows)
    for (let i = 0; i < rows; i++) {
      grid[i] = new Array(cols)
      for (let j = 0; j < cols; j++) {
        grid[i][j] = new Box(i, j)
      }
    }
    addAllNeighbors(grid)
    setGrid(grid)
  }

  function Box(i, j) {
    this.x = i
    this.y = j
    this.isStart = this.x === start_x && this.y === start_y
    this.isEnd = this.x === end_x && this.y === end_y
    this.state = 'Blank'
    this.score = 1000000
    this.gScore = 1000000
    this.hScore = 1000000
    this.neighbors = []
    this.previous = undefined
    this.addNeighbors = function (grid) {
      let pos_x = this.x
      let pos_y = this.y
      if (pos_x > 0) {
        this.neighbors.push(grid[pos_x - 1][pos_y])
      }
      if (pos_y > 0) {
        this.neighbors.push(grid[pos_x][pos_y - 1])
      }
      if (pos_x < rows - 1) {
        this.neighbors.push(grid[pos_x + 1][pos_y])
      }
      if (pos_y < cols - 1) {
        this.neighbors.push(grid[pos_x][pos_y + 1])
      }
    }
  }

  const addAllNeighbors = (grid) => {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        grid[i][j].addNeighbors(grid)
      }
    }
  }

  const makeItClick = (rowIndex, colIndex) => {
    if (rowIndex === start_x && colIndex === start_y) {
      dragStart = true
    } else if (rowIndex === end_x && colIndex === end_y) {
      dragEnd = true
    } else {
      dragWalls = true
    }
  }

  const makeItUnclick = (rowIndex, colIndex) => {
    dragStart = false
    dragEnd = false
    dragWalls = false
  }

  const handleDrag = (rowIndex, colIndex) => {
    if (dragStart) {
      let preStart_x = start_x
      let preStart_y = start_y
      start_x = rowIndex
      start_y = colIndex

      setTimeout(() => {
        document.getElementById(`node-${preStart_x}-${preStart_y}`).className =
          'node'
      }, 10)

      setTimeout(() => {
        document.getElementById(`node-${start_x}-${start_y}`).className =
          'node-start'
      }, 10)

      // console.log("Change !!!",start_x, start_y);
    }
    if (dragEnd) {
      let preEnd_x = end_x
      let preEnd_y = end_y
      end_x = rowIndex
      end_y = colIndex

      setTimeout(() => {
        document.getElementById(`node-${preEnd_x}-${preEnd_y}`).className =
          'node'
      }, 10)

      setTimeout(() => {
        document.getElementById(`node-${end_x}-${end_y}`).className = 'node-end'
      }, 10)

      // console.log("Change !!!",end_x, end_y);
    }
    if (dragWalls) {
      setTimeout(() => {
        document.getElementById(`node-${rowIndex}-${colIndex}`).className =
          'node-wall'
      }, 10)
    }
  }

  const drawGrid = (grid) => {
    return (
      <div>
        {grid.map((row, rowIndex) => {
          return (
            <div key={rowIndex} className='rowWrapper'>
              {row.map((col, colIndex) => {
                const { isStart, isEnd } = col
                // {console.log(grid[rowIndex][colIndex])}
                return (
                  <div
                    onMouseDown={() => {
                      makeItClick(rowIndex, colIndex)
                    }}
                    onMouseUp={() => {
                      makeItUnclick(rowIndex, colIndex)
                    }}
                    onMouseOver={() => {
                      handleDrag(rowIndex, colIndex)
                    }}
                  >
                    <Node
                      key={colIndex}
                      isStart={isStart}
                      isEnd={isEnd}
                      rowIndex={rowIndex}
                      colIndex={colIndex}
                    />
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    )
  }

  const animateFinalPath = (finalPath) => {
    for (let i = 1; i < finalPath.length; i++) {
      setTimeout(() => {
        const node = finalPath[i]
        document.getElementById(`node-${node.x}-${node.y}`).className =
          'node node-shortest-path'
      }, (10 * i) / speedFactor)

      if (i === finalPath.length - 1) {
        setTimeout(() => {
          const node = finalPath[i]
          document.getElementById(`node-${node.x}-${node.y}`).className =
            'node-start'
        }, (10 * i) / speedFactor)
      }
    }
  }

  const letsVisualize = () => {
    for (let i = 0; i <= vn.length; i++) {
      if (i === vn.length) {
        setTimeout(() => {
          animateFinalPath(fp)
        }, (10 * i) / speedFactor)
      } else {
        // console.log(i, vn[i]);
        setTimeout(() => {
          const node = vn[i]
          document.getElementById(`node-${node.x}-${node.y}`).className =
            'node node-visited'
        }, (10 * i) / speedFactor)
      }
    }
  }

  const BFS = () => {
    // setContentIndex(1);
    let startNode = grid[start_x][start_y]
    let endNode = grid[end_x][end_y]

    let ansReturned = bfs(startNode, endNode)
    fp = ansReturned.finalPath
    vn = ansReturned.visited

    letsVisualize()
  }

  const DFS = () => {
    // setContentIndex(2);
    let startNode = grid[start_x][start_y]
    let endNode = grid[end_x][end_y]

    let ansReturned = dfs(grid, startNode, endNode, rows, cols)
    fp = ansReturned.finalPath
    vn = ansReturned.visited

    letsVisualize()
  }

  const Dijkstra = () => {
    // setContentIndex(3);
    let startNode = grid[start_x][start_y]
    let endNode = grid[end_x][end_y]

    let ansReturned = dijkstra(startNode, endNode)
    fp = ansReturned.finalPath
    vn = ansReturned.visited

    letsVisualize()
  }

  const AStar = () => {
    // setContentIndex(4);
    let startNode = grid[start_x][start_y]
    let endNode = grid[end_x][end_y]

    let ansReturned = astar(startNode, endNode)
    fp = ansReturned.finalPath
    vn = ansReturned.visited

    letsVisualize()
  }

  const SimpleMaze = () => {
    let startNode = grid[start_x][start_y]
    let endNode = grid[end_x][end_y]

    let ans = simpleMaze(startNode, endNode, rows, cols)

    for (let i = 0; i < ans.length; i++) {
      let x = ans[i][0]
      let y = ans[i][1]
      setTimeout(() => {
        document.getElementById(`node-${x}-${y}`).className = 'node-wall'
      }, (10 * i) / speedFactor)
    }
  }

  function makeWalls(wallPlace) {
    let startNode = grid[start_x][start_y]
    let endNode = grid[end_x][end_y]

    for (let i = 0; i < wallPlace.length; i++) {
      if (
        !(
          (startNode.x === wallPlace[i][0] &&
            startNode.y === wallPlace[i][1]) ||
          (endNode.x === wallPlace[i][0] && endNode.y === wallPlace[i][1])
        )
      ) {
        setTimeout(() => {
          document.getElementById(
            `node-${wallPlace[i][0]}-${wallPlace[i][1]}`
          ).className = 'node-wall'
        }, (10 * i) / speedFactor)
      }
    }
  }

  const RecursiveDivision = () => {
    let startNode = grid[start_x][start_y]
    let endNode = grid[end_x][end_y]

    let ans = recursiveDivision(startNode, endNode, rows, cols)

    makeWalls(ans)
  }

  const RecursiveBacktracking = () => {
    let startNode = grid[start_x][start_y]
    let endNode = grid[end_x][end_y]

    let ans = recursiveBacktracking(startNode, endNode, rows, cols)
    // console.log(ans);

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (
          !(
            (startNode.x === i && startNode.y === j) ||
            (endNode.x === i && endNode.y === j)
          )
        ) {
          setTimeout(() => {
            document.getElementById(`node-${i}-${j}`).className = 'node-wall'
          }, 0)
        }
      }
    }

    for (let i = 0; i < ans.length; i++) {
      if (
        !(
          (startNode.x === ans[i][0] && startNode.y === ans[i][1]) ||
          (endNode.x === ans[i][0] && endNode.y === ans[i][1])
        )
      ) {
        setTimeout(() => {
          document.getElementById(`node-${ans[i][0]}-${ans[i][1]}`).className =
            'node'
        }, (10 * i) / speedFactor)
      }
    }
  }

  const RandomizedPrims = () => {
    let startNode = grid[start_x][start_y]
    let endNode = grid[end_x][end_y]

    let ans = randomized_Prims(startNode, endNode, rows, cols)
    // console.log(ans);

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (
          !(
            (startNode.x === i && startNode.y === j) ||
            (endNode.x === i && endNode.y === j)
          )
        ) {
          setTimeout(() => {
            document.getElementById(`node-${i}-${j}`).className = 'node-wall'
          }, 0)
        }
      }
    }

    for (let i = 0; i < ans.length; i++) {
      if (
        !(
          (startNode.x === ans[i][0] && startNode.y === ans[i][1]) ||
          (endNode.x === ans[i][0] && endNode.y === ans[i][1])
        )
      ) {
        setTimeout(() => {
          document.getElementById(`node-${ans[i][0]}-${ans[i][1]}`).className =
            'node'
        }, (10 * i) / speedFactor)
      }
    }
  }

  const ClearBoard = () => {
    let startNode = grid[start_x][start_y]
    let endNode = grid[end_x][end_y]

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (
          !(
            (startNode.x === i && startNode.y === j) ||
            (endNode.x === i && endNode.y === j)
          )
        ) {
          setTimeout(() => {
            document.getElementById(`node-${i}-${j}`).className = 'node'
          }, 1)
        } else if (startNode.x === i && startNode.y === j) {
          setTimeout(() => {
            document.getElementById(`node-${i}-${j}`).className = 'node-start'
          }, 1)
        } else if (endNode.x === i && endNode.y === j) {
          setTimeout(() => {
            document.getElementById(`node-${i}-${j}`).className = 'node-end'
          }, 0)
        }
      }
    }
  }

  const ClearPath = () => {
    let startNode = grid[start_x][start_y]
    let endNode = grid[end_x][end_y]

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (
          document.getElementById(`node-${i}-${j}`).className ===
            'node node-visited' ||
          document.getElementById(`node-${i}-${j}`).className ===
            'node node-shortest-path'
        ) {
          setTimeout(() => {
            document.getElementById(`node-${i}-${j}`).className = 'node'
          }, 0)
        }
      }
    }
  }

  const tutorialButton = () => {
    setIsDone([1, 0, 0, 0, 0, 0])
  }

  const tutorialPage = () => {
    return (
      <div>
        <Modal isOpen={isDone[0]} className='Modal'>
          <div className='container'>
            <p style={{ fontSize: '10px' }}> </p>
            <p className='modelHeading_light' style={{ textAlign: 'center' }}>
              <b>Welcome to Pathfinding Algorithm Visualizer</b>
            </p>
            <p style={{ fontSize: '15px' }}> </p>
            <p
              className='modelHeading_light'
              style={{ textAlign: 'center', fontSize: '35px' }}
            >
              This short tutorial will walk you through all of the features of
              this application.
            </p>
            <p
              className='modelHeading_light'
              style={{ textAlign: 'center', fontSize: '35px' }}
            >
              If you want to dive right in, feel free to press the "Skip
              Tutorial" button below. Otherwise, press "Next"!
            </p>

            <div className='row'>
              <div className='col-sm-12' align='center'>
                <img src={page1} alt='page1' style={{ width: '30%' }}></img>
              </div>
            </div>
            <div className='row'>
              <div className='col-sm-4' align='center'>
                <button
                  onClick={() => {
                    setIsDone([0, 0, 0, 0, 0, 0])
                  }}
                  className='modalButton'
                >
                  Skip
                </button>
              </div>
              <div className='col-sm-4' align='center'>
                <p
                  className='modelHeading_light'
                  style={{ fontSize: '25px', paddingTop: '2.5%' }}
                >
                  Page 1
                </p>
              </div>
              <div className='col-sm-4' align='center'>
                <button
                  onClick={() => {
                    setIsDone([1, 0, 0, 0, 0, 0])
                  }}
                  style={{ width: '1%', visibility: 'hidden' }}
                  className='modalButton'
                >
                  ⯇
                </button>
                &nbsp;&nbsp;
                <button
                  onClick={() => {
                    setIsDone([0, 1, 0, 0, 0, 0])
                  }}
                  style={{ width: '1%' }}
                  className='modalButton'
                >
                  ⯈
                </button>
              </div>
            </div>
          </div>
        </Modal>
        <Modal isOpen={isDone[1]} className='Modal'>
          <p style={{ fontSize: '10px' }}> </p>
          <p className='modelHeading_light' style={{ textAlign: 'center' }}>
            <b>What is a pathfinding algorithm?</b>
          </p>
          <p style={{ fontSize: '15px' }}> </p>
          <p
            className='modelHeading_light'
            style={{ textAlign: 'center', fontSize: '33.5px' }}
          >
            At its core, a pathfinding algorithm seeks to find the shortest path
            between two points. This application visualizes various pathfinding
            algorithms in action, and more!
          </p>
          <p
            className='modelHeading_light'
            style={{ textAlign: 'center', fontSize: '33.5px' }}
          >
            All of the algorithms on this application are adapted for a 2D grid.
          </p>

          <div className='row'>
            <div className='col-sm-12' align='center'>
              <img src={page2} alt='page2' style={{ width: '17.5%' }}></img>
            </div>
          </div>
          <div className='row'>
            <div className='col-sm-4' align='center'>
              <button
                onClick={() => {
                  setIsDone([0, 0, 0, 0, 0, 0])
                }}
                className='modalButton'
              >
                Skip
              </button>
            </div>
            <div className='col-sm-4' align='center'>
              <p
                className='modelHeading_light'
                style={{ fontSize: '25px', paddingTop: '2.5%' }}
              >
                Page 2
              </p>
            </div>
            <div className='col-sm-4' align='center'>
              <button
                onClick={() => {
                  setIsDone([1, 0, 0, 0, 0, 0])
                }}
                style={{ width: '1%' }}
                className='modalButton'
              >
                ⯇
              </button>
              &nbsp;&nbsp;
              <button
                onClick={() => {
                  setIsDone([0, 0, 1, 0, 0, 0])
                }}
                style={{ width: '1%' }}
                className='modalButton'
              >
                ⯈
              </button>
            </div>
          </div>
        </Modal>

        <Modal isOpen={isDone[2]} className='Modal'>
          <p style={{ fontSize: '10px' }}> </p>
          <p className='modelHeading_light' style={{ textAlign: 'center' }}>
            <b>Picking an algorithm</b>
          </p>
          <p style={{ fontSize: '15px' }}> </p>
          <p
            className='modelHeading_light'
            style={{ textAlign: 'center', fontSize: '33.5px' }}
          >
            Choose an algorithm from the "Algorithms" drop-down menu from the
            Side-Bar.
          </p>
          <p
            className='modelHeading_light'
            style={{ textAlign: 'center', fontSize: '33.5px' }}
          >
            Note : Not all algorithms guarantee the shortest path.{' '}
          </p>

          <div className='row'>
            <div className='col-sm-12' align='center'>
              <img
                src={gifAlgo}
                alt='gifAlgo'
                style={{ width: '17.25%' }}
              ></img>
            </div>
          </div>
          <div className='row'>
            <div className='col-sm-4' align='center'>
              <button
                onClick={() => {
                  setIsDone([0, 0, 0, 0, 0, 0])
                }}
                className='modalButton'
              >
                Skip
              </button>
            </div>
            <div className='col-sm-4' align='center'>
              <p
                className='modelHeading_light'
                style={{ fontSize: '25px', paddingTop: '2.5%' }}
              >
                Page 3
              </p>
            </div>
            <div className='col-sm-4' align='center'>
              <button
                onClick={() => {
                  setIsDone([0, 1, 0, 0, 0, 0])
                }}
                style={{ width: '1%' }}
                className='modalButton'
              >
                ⯇
              </button>
              &nbsp;&nbsp;
              <button
                onClick={() => {
                  setIsDone([0, 0, 0, 1, 0, 0])
                }}
                style={{ width: '1%' }}
                className='modalButton'
              >
                ⯈
              </button>
            </div>
          </div>
        </Modal>

        <Modal isOpen={isDone[3]} className='Modal'>
          <p style={{ fontSize: '10px' }}> </p>
          <p className='modelHeading_light' style={{ textAlign: 'center' }}>
            <b>Meet the algorithms</b>
          </p>
          <p style={{ fontSize: '15px' }}> </p>
          <p
            className='modelHeading_light'
            style={{ textAlign: 'center', fontSize: '33.5px' }}
          >
            <b>Breath-first Search</b> : level wise search; guarantees the
            shortest path
          </p>
          <p
            className='modelHeading_light'
            style={{ textAlign: 'center', fontSize: '33.5px' }}
          >
            <b>Depth-first Search</b> : a very bad algorithm for pathfinding;
            does not guarantee the shortest path
          </p>
          <p
            className='modelHeading_light'
            style={{ textAlign: 'center', fontSize: '33.5px' }}
          >
            <b>Dijkstra's Algorithm</b> : the father of pathfinding algorithms;
            guarantees the shortest path
          </p>
          <p
            className='modelHeading_light'
            style={{ textAlign: 'center', fontSize: '33.5px' }}
          >
            <b>A* Search</b> : arguably the best pathfinding algorithm; uses
            heuristics to guarantee{' '}
          </p>
          <p
            className='modelHeading_light'
            style={{ textAlign: 'center', fontSize: '33.5px' }}
          >
            the shortest path much faster than Dijkstra's Algorithm
          </p>
          <p style={{ fontSize: '26px' }}>&nbsp;</p>

          <div className='row'>
            <div className='col-sm-4' align='center'>
              <button
                onClick={() => {
                  setIsDone([0, 0, 0, 0, 0, 0])
                }}
                className='modalButton'
              >
                Skip
              </button>
            </div>
            <div className='col-sm-4' align='center'>
              <p
                className='modelHeading_light'
                style={{ fontSize: '25px', paddingTop: '2.5%' }}
              >
                Page 4
              </p>
            </div>
            <div className='col-sm-4' align='center'>
              <button
                onClick={() => {
                  setIsDone([0, 0, 1, 0, 0, 0])
                }}
                style={{ width: '1%' }}
                className='modalButton'
              >
                ⯇
              </button>
              &nbsp;&nbsp;
              <button
                onClick={() => {
                  setIsDone([0, 0, 0, 0, 1, 0])
                }}
                style={{ width: '1%' }}
                className='modalButton'
              >
                ⯈
              </button>
            </div>
          </div>
        </Modal>

        <Modal isOpen={isDone[4]} className='Modal'>
          <p style={{ fontSize: '10px' }}> </p>
          <p className='modelHeading_light' style={{ textAlign: 'center' }}>
            <b>Adding walls</b>
          </p>
          <p style={{ fontSize: '15px' }}> </p>
          <p
            className='modelHeading_light'
            style={{ textAlign: 'center', fontSize: '33.5px' }}
          >
            Click on the grid to add a wall. Walls are impenetrable, meaning
            that a path cannot cross through them.
          </p>
          <p
            className='modelHeading_light'
            style={{ textAlign: 'center', fontSize: '33.5px' }}
          >
            Generate mazes and patterns from the "Mazes & Patterns" drop-down
            menu.
          </p>

          <div className='row'>
            <div className='col-sm-12' align='center'>
              <img
                src={gifWalls}
                alt='gifWalls'
                style={{ width: '21.15%' }}
              ></img>
            </div>
          </div>

          <div className='row'>
            <div className='col-sm-4' align='center'>
              <button
                onClick={() => {
                  setIsDone([0, 0, 0, 0, 0, 0])
                }}
                className='modalButton'
              >
                Skip
              </button>
            </div>
            <div className='col-sm-4' align='center'>
              <p
                className='modelHeading_light'
                style={{ fontSize: '25px', paddingTop: '2.5%' }}
              >
                Page 5
              </p>
            </div>
            <div className='col-sm-4' align='center'>
              <button
                onClick={() => {
                  setIsDone([0, 0, 0, 1, 0, 0])
                }}
                style={{ width: '1%' }}
                className='modalButton'
              >
                ⯇
              </button>
              &nbsp;&nbsp;
              <button
                onClick={() => {
                  setIsDone([0, 0, 0, 0, 0, 1])
                }}
                style={{ width: '1%' }}
                className='modalButton'
              >
                ⯈
              </button>
            </div>
          </div>
        </Modal>

        <Modal isOpen={isDone[5]} className='Modal'>
          <p style={{ fontSize: '10px' }}> </p>
          <p className='modelHeading_light' style={{ textAlign: 'center' }}>
            <b>Visualizing and more..</b>
          </p>
          <p style={{ fontSize: '15px' }}> </p>
          <p
            className='modelHeading_light'
            style={{ textAlign: 'center', fontSize: '33.5px' }}
          >
            Use the Navbar button to visualize algorithms and Side-Bar buttons
            to do other stuff!
          </p>
          <p
            className='modelHeading_light'
            style={{ textAlign: 'center', fontSize: '33.5px' }}
          >
            You can clear the current path, clear the board, and adjust the
            visualization speed, all from the Side-Bar.
          </p>

          <div className='row'>
            <div className='col-sm-6' align='center'>
              <img src={page61} alt='page61' style={{ width: '80%' }}></img>
            </div>
            <div className='col-sm-6' align='center'>
              <img src={page62} alt='page62' style={{ width: '65%' }}></img>
            </div>
          </div>

          <div className='row'>
            <div className='col-sm-4' align='center'>
              <button
                onClick={() => {
                  setIsDone([0, 0, 0, 0, 0, 0])
                }}
                className='modalButton'
              >
                Skip
              </button>
            </div>
            <div className='col-sm-4' align='center'>
              <p className='modelHeading_light' style={{ fontSize: '35px' }}>
                <b>Enjoy !</b>
              </p>
            </div>
            <div className='col-sm-4' align='center'>
              <button
                onClick={() => {
                  setIsDone([0, 0, 0, 0, 1, 0])
                }}
                style={{ width: '1%' }}
                className='modalButton'
              >
                ⯇
              </button>
              &nbsp;&nbsp;
              <button
                onClick={() => {
                  setIsDone([0, 0, 0, 0, 0, 0])
                }}
                style={{ width: '1%' }}
                className='modalButton'
              >
                ⯈
              </button>
            </div>
          </div>
        </Modal>
      </div>
    )
  }

  const handleCallBack = (childData) => {
    // console.log(childData);
    speedFactor = childData
  }
  // #94BCD2
  return (
    <div style={{ backgroundColor: 'white' }}>
      <SideBar
        letsVisualize={letsVisualize}
        BFS={BFS}
        DFS={DFS}
        Dijkstra={Dijkstra}
        AStar={AStar}
        SimpleMaze={SimpleMaze}
        RecursiveDivision={RecursiveDivision}
        RecursiveBacktracking={RecursiveBacktracking}
        RandomizedPrims={RandomizedPrims}
        ClearBoard={ClearBoard}
        ClearPath={ClearPath}
        tutorialButton={tutorialButton}
        isDone={isDone}
        parentCallback={handleCallBack}
      />

      <div className='container col-12'>
        <div className='row'>
          <div
            className='col-lg-12'
            style={{ paddingLeft: '1.5px', paddingTop: '1.5px' }}
          >
            {drawGrid(grid)}
          </div>
          {tutorialPage()}
        </div>
      </div>
    </div>
  )
}

export default Main
