function isWithinTheGrid( X, Y, rows, cols ){
    let condition1 = (X >= 0)&&(X < rows);
    let condition2 = (Y >= 0)&&(Y < cols);
    return (condition1&&condition2);
}

function dfs( grid, startNode, endNode, rows, cols ){
    let stack = [];
    let finalPath = [];
    let visited = [];
    let nb = [ [-1, 0], [0, -1], [1, 0], [0, 1] ];

    stack.push(startNode);
    while( stack.length > 0 ){
        let size = stack.length;
        let current  = stack.pop();

        if( current == endNode ){
            console.log("Done Done Done !!!");

            let temp = current;
            finalPath.push(temp);
            while( temp.previous ){
                finalPath.push(temp.previous);
                temp = temp.previous;
            }

            return {finalPath, visited};
        }

        stack = stack.filter(elt => elt!==current);
        visited.push(current);

        // console.log("_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_")
        // console.log("current : ", current);

        for( let i=0;i<4;i++ ){
            let newX = current.x + nb[i][0];
            let newY = current.y + nb[i][1];

            if( isWithinTheGrid(newX, newY, rows, cols) ){
                // console.log("corresponding nb : ", newX, newY);
                if( document.getElementById(`node-${newX}-${newY}`).className != 'node-wall' ){
                    let newNode = grid[newX][newY];
                    if( !visited.includes(newNode) ){
                        // console.log("corresponding nb (Inside) : ", newNode);
                        stack.push(newNode);
                        newNode.previous = current;
                    }
                }
            }
        }
    }

    return {finalPath, visited, error:'No Path Found!!!'};
}

export default dfs;
