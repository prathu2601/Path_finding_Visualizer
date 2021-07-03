function bfs( startNode, endNode ){
    let q = [];
    let visited = [];
    let finalPath = [];

    q.push(startNode);
    while( q.length > 0 ){
        let current = q[0];
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

        q = q.filter(elt => elt!==current);
        visited.push(current);

        for( let nbPos = 0; nbPos < current.neighbors.length ; nbPos++ ){
            let neighbor = current.neighbors[nbPos];

            if( document.getElementById(`node-${neighbor.x}-${neighbor.y}`).className == 'node-wall' ){
                continue;
            }

            if( !visited.includes(neighbor) ){
                if( !q.includes(neighbor) ){
                    q.push(neighbor);
                    neighbor.previous = current;       
                }
            }
        }
    }

    return {finalPath, visited, error:'No Path Found!!!'};
}

export default bfs;
