
function deleteRow(arr, row) {
  let pos = undefined;
  for( let i=0;i<arr.length;i++ ){
    if( arr[i][0]==row[0] && arr[i][1]==row[1] ){
      pos = i;
    }
  }
  
  pos += 1;
  
  arr = arr.slice(0); 
  arr.splice(pos - 1, 1);
  return arr;
}
  
function check( arr, num ){
  for( let i=0;i<arr.length;i++ ){
    if( arr[i][0]==num[0] && arr[i][1]==num[1] ){
      return 1;
    }
  }
  return 0;
}

function isWithinTheGrid( x, y, rows, cols ){
    let condition1 = (x >= 0)&&(x < rows);
    let condition2 = (y >= 0)&&(y < cols);
    return (condition1 && condition2);
}

function isStartEnd( posX, posY, startNode, endNode ){
    let condition1 = (startNode.x == posX)&&(startNode.y == posY);
    let condition2 = (endNode.x == posX)&&(endNode.y == posY);

    return (condition1 || condition2);
}

function generateNumber( min, max ){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); 
}

function checkAdjPos( psudoGrid, x, y, width, height, checkList, notWalls ){
    let direction = [];
    
    if( x > 0 ){
        if( psudoGrid[2*(x-1) + 1][2*y + 1] === 1 ){
            direction.push( 'L' );
        }
    }
    if( y > 0 ){
        if( psudoGrid[2*x + 1][2*(y-1) + 1] === 1 ){
            direction.push( 'U' );
        }
    }
    if( x < width-1 ){
        if( psudoGrid[2*(x+1) + 1][2*y + 1] === 1 ){
            direction.push( 'R' );
        }
    }
    if( y < height-1 ){
        if( psudoGrid[2*x + 1][2*(y+1) + 1] === 1 ){
            direction.push( 'D' );
        }
    }

    // console.log("$%^&", direction);

    if( direction.length > 0 ){
        let chosenDir = direction[Math.floor(Math.random()*direction.length)];
        // console.log("###", chosenDir, direction);
        if( chosenDir === 'L' ){
            checkList.push( [x-1, y] );
            psudoGrid[2*x][2*y+1] = 0;
            psudoGrid[2*(x-1)+1][2*y+1] = 0;

            notWalls.push([2*x, 2*y+1]);
            notWalls.push([2*(x-1)+1, 2*y+1]);
        }
        else if( chosenDir === 'U' ){
            checkList.push( [x, y-1] );
            psudoGrid[2*x+1][2*y] = 0;
            psudoGrid[2*x+1][2*(y-1)+1] = 0;

            notWalls.push([2*x+1, 2*y]);
            notWalls.push([2*x+1, 2*(y-1)+1]);
        }
        else if( chosenDir === 'R' ){
            checkList.push( [x+1, y] );
            psudoGrid[2*x+2][2*y+1] = 0;
            psudoGrid[2*(x+1)+1][2*y+1] = 0;

            notWalls.push([2*x+2, 2*y+1]);
            notWalls.push([2*(x+1)+1, 2*y+1]);
        }
        else if( chosenDir === 'D' ){
            checkList.push( [x, y+1] );
            psudoGrid[2*x+1][2*y+2] = 0;
            psudoGrid[2*x+1][2*(y+1)+1] = 0;

            notWalls.push([2*x+1, 2*y+2]);
            notWalls.push([2*x+1, 2*(y+1)+1]);
        }
        return true;
    }
    else{
        return false;
    }
}

function recursiveBacktracking_helper( psudoGrid, startNode, endNode, width, heigth, rows, cols, notWalls ){
    let mazeStartX = generateNumber(0, width-1);
    let mazeStartY = generateNumber(0, heigth-1);

    // console.log(mazeStartX, mazeStartY, "width : ", width, "heigth : ", heigth);
    // console.log(psudoGrid, psudoGrid[2*mazeStartX + 1][2*mazeStartY + 1]);
    psudoGrid[2*mazeStartX + 1][2*mazeStartY + 1] = 0;
    notWalls.push([2*mazeStartX + 1, 2*mazeStartY + 1]);

    let checkList = [];
    checkList.push( [mazeStartX, mazeStartY] );

    while( checkList.length > 0 ){
        // console.log("!!!", psudoGrid, checkList); 

        let size = checkList.length;
        let topEntry = checkList[size-1];

        if( !(checkAdjPos(psudoGrid, topEntry[0], topEntry[1], width, heigth, checkList, notWalls)) ){
            checkList = deleteRow( checkList, topEntry );
        }
    }
}

function recursiveBacktracking( startNode, endNode, rows, cols ){
    let notWalls = [];

    let psudoGrid = new Array(rows);
    for( let i=0;i<rows;i++ ){
      psudoGrid[i] = new Array(cols);
      for( let j=0;j<cols;j++ ){
          psudoGrid[i][j] = 1;// 0 indicates empty, 1 indicates walls
      } 
    }    

    recursiveBacktracking_helper( psudoGrid, startNode, endNode, (rows-1)/2, (cols-1)/2, rows, cols, notWalls );

    return notWalls;
}

export default recursiveBacktracking;
