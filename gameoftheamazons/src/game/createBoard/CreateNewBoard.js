export const createBoard = async (rows) => {

    var size = Number(rows)
    var b = new Array(size);
    for ( let i = 0 ; i < size; i++) {
        b[i] = new Array(size)
    }

    for (let i = 0; i < b.length; i++){
        for (let j = 0; j < b[i].length; j++){
            b[i][j] = -1;
        }
    }

    // console.log(b);

    return b;
}