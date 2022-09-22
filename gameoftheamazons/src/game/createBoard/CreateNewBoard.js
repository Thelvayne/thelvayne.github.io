export const createBoard = async (rows) => {

    var b = new Array(10);
    for ( let i = 0 ; i < rows; i++) {
        b[i] = new Array(10)
    }

    for (let i = 0; i < b.length; i++){
        for (let j = 0; j < b[i].length; j++){
            b[i][j] = -1;
        }
    }

    console.log(b);

    return b;
}