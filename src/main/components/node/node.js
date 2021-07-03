import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

import './node.css';

let sizeFactor = 61.12;

function Node( {isStart, isEnd, rowIndex, colIndex} ) {
    const classes = (isStart)?('node-start'):( (isEnd)?('node-end'):('') );

    // const [size, setSize] = useState([window.innerWidth, window.innerHeight]);
    // useEffect(()=>{
    //     const handleResize = () => {
    //         setSize([window.innerWidth, window.innerHeight]);
    //     };
    //     window.addEventListener("resize", handleResize);
    //     return ()=>{
    //         window.removeEventListener("resize", handleResize);
    //     };
    // }, []);

    return (
        <div 
            className={`node ${classes}`}
            id={`node-${rowIndex}-${colIndex}`}
            style={{width: window.innerWidth/sizeFactor, height: window.innerHeight/27.75}}></div>
    );
}

export default Node;
