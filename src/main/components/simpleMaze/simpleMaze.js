import { scryRenderedComponentsWithType } from "react-dom/test-utils";

function simpleMaze( startNode, endNode, rows, cols ){
    let walls = [];

    let random_0_1 = [0, 1, 1, 1];

    for( let i=0;i<rows;i++ ){
        for( let j=0;j<cols;j++ ){
            if( !(startNode.x == i && startNode.y == j) ){
                if( !(endNode.x == i && endNode.y == j) ){
                    let random = Math.floor(Math.random() * random_0_1.length);
                    if( random_0_1[random] == 0 ){
                        walls.push([i, j]);
                    }
                }
            }

        }
    }

    return walls;
}

export default simpleMaze;
