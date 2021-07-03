function astar( startNode, endNode ){
    let q = [];
    let visited = [];
    let finalPath = [];

    q.push(startNode);
    while( q.length > 0 ){
        let minPos = 0;
        for( let i=0;i<q.length;i++ ){
            if( q[i].score < q[minPos].score ){
                minPos = i;
            }
        }

        let current = q[minPos];
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
                let temp_gScore = current.gScore + 1;
                let newPath = false;
                if( q.includes(neighbor) ){
                    if( temp_gScore < neighbor.gScore ){
                        neighbor.gScore = temp_gScore;
                        newPath = true;
                    }
                }
                else{
                    neighbor.gScore = temp_gScore;
                    newPath = true;
                    q.push(neighbor);
                }

                if( newPath ){
                    neighbor.hScore = heruistic(neighbor, endNode);
                    neighbor.score = neighbor.gScore + neighbor.hScore;
                    neighbor.previous = current;
                }
            }
        }
    }

    return {finalPath, visited, error:'No Path Found!!!'};
}

function heruistic( start, end ){
    let dx = Math.abs(start.x - end.x) * Math.abs(start.x - end.x);
    let dy = Math.abs(start.y - end.y) * Math.abs(start.y - end.y);
    return Math.sqrt( dx + dy );
}

export default astar;
