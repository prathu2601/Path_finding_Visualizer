import React, { useState, Component } from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import { DropdownMultiple, Dropdown } from 'reactjs-dropdown-component';

import Slider from 'react-input-slider';

import menu from './menu.png';
import close from './close.png';

import './sideBar.css';

// let selectedAlgo = undefined;

const Algorithms = [
  {
    label: 'Breadth-First Search',
    value: 'Breadth-First Search',
  },
  {
    label: 'Depth-First Search',
    value: 'Depth-First Search',
  },
  {
    label: 'Dijkstra\'s Algorithm',
    value: 'Dijkstra algorithm',
  },
  {
    label: 'A-Star Search',
    value: 'A-Star Search',
  }
];

const MazeGenerator = [
  {
    label: 'Simple-Maze',
    value: 'Simple-Maze',
  },
  {
    label: 'Recursive-Backtracking',
    value: 'Recursive-Backtracking',
  },
  {
    label: 'Recursive-Division',
    value: 'Recursive-Division',
  },{
    label: 'Randomized-Prims',
    value: 'Randomized-Prims',
  }
];

const SideBar = ( props ) => {
    const [slider, setSlider] = useState(1);
    const [selectedAlgo, setSelectedAlgo] = useState("Pathfinding Algorithms");
    // const [selectedMaze, setSelectedMaze] = useState("Mazes & Patterns");

    const openNav = () => {
        document.getElementById("sidebar").style.width = "385px";
    }
    const closeNav = () => {
        document.getElementById("sidebar").style.width = "0";
    }
    const handleAlgo = (e) => {
      let chosenAlgo = e.value;

      if( chosenAlgo === 'Breadth-First Search' ){
        setSelectedAlgo('Breadth-First Search');
        // selectedAlgo = 'Breadth-First Search';
      }
      else if( chosenAlgo === 'Depth-First Search' ){
        setSelectedAlgo('Depth-First Search');
        // selectedAlgo = 'Depth-First Search';
      }
      else if( chosenAlgo === 'Dijkstra algorithm' ){
        setSelectedAlgo('Dijkstra algorithm');
        // selectedAlgo = 'Dijkstra algorithm';
      }
      if( chosenAlgo === 'A-Star Search' ){
        setSelectedAlgo('A-Star Search');
        // selectedAlgo = 'A-Star Search';
      }

      if( chosenAlgo === 'Simple-Maze' ){
        closeNav();
        props.SimpleMaze();
      }
      if( chosenAlgo === 'Recursive-Division' ){
        closeNav();
        props.RecursiveDivision();
      }
      if( chosenAlgo === 'Recursive-Backtracking' ){
        closeNav();
        props.RecursiveBacktracking();
      }
      if( chosenAlgo === 'Randomized-Prims' ){
        closeNav();
        props.RandomizedPrims();
      }
    }

    const finalVisualise = (e) => {

      if( selectedAlgo == 'A-Star Search' ){
        props.AStar();
      }
      else if( selectedAlgo === 'Breadth-First Search' ){
        props.BFS();
      }
      else if( selectedAlgo === 'Depth-First Search' ){
        props.DFS();
      }
      else if( selectedAlgo === 'Dijkstra algorithm' ){
        props.Dijkstra();
      }

      // if( selectedMaze === 'Simple-Maze' ){
      //   props.SimpleMaze();
      // }
      // if( selectedMaze === 'Recursive-Division' ){
      //   props.RecursiveDivision();
      // }
      // if( selectedMaze === 'Recursive-Backtracking' ){
      //   props.RecursiveBacktracking();
      // }

      // setSelectedAlgo("Pathfinding Algorithms");
      // setSelectedMaze("Mazes & Patterns");
    }

    const handleSpeedFactor = (x) => {
      setSlider((x.x).toFixed(2));
      props.parentCallback(x.x);
    }

    const tutorialButton_handler = () => {
      closeNav();
      props.tutorialButton();
    }

  return (
    <>
        <div id='sidebar' className='sidebar'>
            <h4 style={{ fontSize:'75px', textAlign:'left', paddingLeft:'3.5%' }} className='titleClass'>Pathfinding</h4>
            <h4 style={{ fontSize:'75px', textAlign:'left', paddingLeft:'3.5%' }} className='titleClass'>Visualiser</h4>

            <div className='container-sm'>
                <h4><br></br></h4>
                <Dropdown
                  name="Algorithms-temp"
                  title="Pathfinding Algorithms"
                  list={Algorithms}
                  onChange={(e)=>{handleAlgo(e)}}/>
                <h4><br></br></h4>
                <Dropdown
                  name="MazeGenerator-TEMP"
                  title="Mazes & Patterns"
                  list={MazeGenerator}
                  onChange={(e)=>{handleAlgo(e)}}/>
                <h4><br></br></h4>
                <div className='row'>
                  <div className='col-sm-6'>
                    <button
                      className='sidebar_button'
                      style={{width:'160px', fontSize:'27px'}}
                      onClick={()=>{props.ClearBoard()}}>Clear Board</button>
                  </div>
                  <div className='col-sm-6'>
                    <button
                      className='sidebar_button'
                      style={{width:'155px', fontSize:'27px'}}
                      onClick={()=>{props.ClearPath()}}>Clear Path</button>
                  </div>
                </div>
                <h4><br></br></h4>
                <React.Fragment>
                  <div
                    className='speed'>{'Speed'}</div>
                    {/* : ' + slider */}
                  <Slider
                    axis="x"
                    xstep={0.01}
                    xmin={0.25}
                    xmax={2}
                    x={slider}
                    style={{width:'350px'}}
                    styles={{
                      width:'350px',
                      track: {
                        backgroundColor: '#f3f4ed'
                      },
                      active: {
                        backgroundColor: '#f8e9a1'
                      },
                      thumb: {
                        backgroundColor: '#36a1d4'
                      }
                    }}
                    onChange={(x) => {handleSpeedFactor(x)}}
                  />
                </React.Fragment>

                <h4><br></br></h4>
                <div className='row'>
                  <div className='col-sm-6'>
                    <button
                      className='sidebar_button'
                      style={{width:'160px', fontSize:'27px'}}
                      onClick={()=>{closeNav()}}>Close</button>
                  </div>
                  <div className='col-sm-6'>
                    <button
                      className='sidebar_button'
                      style={{width:'155px', fontSize:'27px'}}
                      onClick={()=>{tutorialButton_handler()}}>Tutorial</button>
                  </div>
                </div>
            </div>
        </div>

        <div className='navbar navbar-dark bg-dark'>
            <div className='col-sm-3'>
                <button onClick={()=>{openNav()}}
                    className='sidebar_open'>
                        ☰ Algorithms
                </button>
                &nbsp;&nbsp;
                <button onClick={(e)=>{finalVisualise(e)}}
                    className='sidebar_open'>
                        Visualize
                </button>
            </div>
            <div className='col-sm-3'></div>
            <div className='col-sm-3'></div>
            <div className='col-sm-3'>
              <div className='titleClass'><b>Pathfinding Visualiser</b></div>
            </div>
        </div>
    </>
  );
}

export default SideBar;