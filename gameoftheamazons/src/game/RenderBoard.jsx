import { getGameByID } from "../communication/Communication"


export const RenderBoard = async (gameID) => {

    const current = await getGameByID(gameID);
    const currentBoard = current.board.squares;
    
    //do something with currentBoard
    return currentBoard; //not really
}

export const BackgroundColor = (row, column) => {
    const cond1 = (row % 2 === 0 && column % 2 === 0);
    const cond2 = (row % 2 !== 0 && column % 2 !== 0);
    if (cond1 || cond2) {
        return "box white"
    } else {
        return "box black"
    }
}

export const PlaceAmazons = (value) => {
    if (value === 0) {
        return "pieceblack"
    } else if (value === 1) {
        return "piecewhite"
    } else if (value === -2) {
        return "arrow"
    } else {
        return ""
    }
}