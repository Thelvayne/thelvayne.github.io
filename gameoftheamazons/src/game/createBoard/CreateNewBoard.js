export const createBoard = async (rows) => {
    let board = () => {
        var b;
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < rows; i++) {
                b[i][j] = -1;
            }
        }
        return b;
    } 
    // TODO: add algorithm for creating game according to user-input

    return board;
}