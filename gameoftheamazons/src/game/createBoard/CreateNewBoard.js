import { newGame } from "../../communication/Communication"

export const createBoard = async (rows, columns, amountAmazons) => {
    let board = [
    [0, -1, 0, -1, 0, -1, 0, -1, 0, -1],
    [0, -1, -1, -1, -1, -1, -1, -1, -1, 0],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [1, -1, -1, -1, -1, -1, -1, -1, -1, 1],
    [1, -1, 1, -1, 1, -1, 1, -1, 1, -1]
]
    // TODO: add algorithm for creating game according to user-input

    return board;
}