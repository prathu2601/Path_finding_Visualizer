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

function getWallIndex( corner, size ){
    let wallPos = undefined;
    if( size >= 3 ){
        wallPos = generateNumber(corner+1, corner+size-2);
        if( wallPos%2 == 1 ){
            wallPos -= 1;
        }

        return wallPos;
    }
    else{
        return ;
    }
}

function makeOpening( psudoGrid, x, y, width, heigth, wallX, wallY, rows, cols, walls ){
    //Total openings
    let openings = [];
    
    //Possible Opening
    let possibleOpening = [ [generateNumber(x, wallX-1), wallY], [generateNumber(wallX+1, x+width-1), wallY], [wallX, generateNumber(y, wallY-1)], [wallX, generateNumber(wallY+1, y+heigth-1)] ];
    
    //Margin Opening
    let marginOpening = [ [x, wallY], [x+width-1, wallY], [wallX, y], [wallX, y+heigth-1] ];

    //Adjecent opening
    let adjOpening = [ [x-1, wallY], [x+width, wallY], [wallX, y-1], [wallX, y+heigth] ];

    for( let i=0;i<4;i++ ){
        let adjX = adjOpening[i][0];
        let adjY = adjOpening[i][1];

        if( isWithinTheGrid(adjX, adjY, rows, cols) && psudoGrid[adjX][adjY]==0 ){
            psudoGrid[marginOpening[i][0]][marginOpening[i][1]] = 0;
        }
        else{
            openings.push( possibleOpening[i] );
        }
    }

    let ignoreIt = generateNumber(0, possibleOpening.length - 1);

    for( let i=0; i<openings.length; i++ ){
        if( i != ignoreIt ){
            psudoGrid[openings[i][0]][openings[i][1]] = 0;
        }
    }
}

function recursiveDivision_helper( psudoGrid, startNode, endNode, d, width, heigth, rows, cols, walls ){
    if( width<=1 || heigth<=1 ){
        return;
    }

    let wallX = getWallIndex(d[0], width);
    let wallY = getWallIndex(d[1], heigth);

    for( let i=d[0]; i < d[0]+width; i++ ){
        if( isStartEnd(i, wallY, startNode, endNode) ){
            continue;
        }

        psudoGrid[i][wallY] = 1;
        walls.push( [i, wallY] );
    }

    for( let i=d[1] ;i < d[1]+heigth ;i++ ){
        if( isStartEnd(wallX, i, startNode, endNode) ){
            continue;
        }

        psudoGrid[wallX][i] = 1;
        walls.push( [wallX, i] );
    }

    makeOpening( psudoGrid, d[0], d[1], width, heigth, wallX, wallY, rows, cols, walls );

    recursiveDivision_helper( psudoGrid, startNode, endNode, d, wallX-d[0], wallY-d[1], rows, cols, walls );
    recursiveDivision_helper( psudoGrid, startNode, endNode, [d[0], wallY+1], wallX-d[0], d[1]+heigth-wallY-1, rows, cols, walls );
    recursiveDivision_helper( psudoGrid, startNode, endNode, [wallX+1, d[1]], d[0]+width-wallX-1, wallY-d[1], rows, cols, walls );
    recursiveDivision_helper( psudoGrid, startNode, endNode, [wallX+1, wallY+1], d[0]+width-wallX-1, d[1]+heigth-wallY-1, rows, cols, walls );
}

function recursiveDivision( startNode, endNode, rows, cols ){
    let psudoGrid = new Array(rows);
    let walls = [];
    for( let i=0;i<rows;i++ ){
      psudoGrid[i] = new Array(cols);
      for( let j=0;j<cols;j++ ){
          psudoGrid[i][j] = 0;// 0 indicates empty
      } 
    }    

    //Marking the boudries as walls
    for( let i=0;i<rows;i++ ){
        psudoGrid[i][0] = 1;
        walls.push( [i, 0] );

        psudoGrid[i][cols-1] = 1;
        walls.push( [i, cols-1] );
    }

    //Marking the boudries as walls
    for( let j=0;j<cols;j++ ){
        psudoGrid[0][j] = 1;
        walls.push( [0, j] );

        psudoGrid[rows-1][j] = 1;
        walls.push( [rows-1, j] );
    }

    recursiveDivision_helper( psudoGrid, startNode, endNode, [1, 1], rows-2, cols-2, rows, cols, walls );

    for( let i=0;i<rows;i++ ){
        for( let j=0;j<cols;j++ ){
            if( check(walls, [i, j]) && psudoGrid[i][j]==0 ){
                walls = deleteRow(walls, [i, j] );
            }
        }
    }

    return walls;
}

export default recursiveDivision;
