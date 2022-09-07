export const GeneratePlayfield = (rows, columns, amountAmazons) => {
    var playfield;
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++){
            playfield[i][j] = -1;
        }
    }

    //TODO: Algorithmus für das Plazieren der Amazonen

    return playfield;
}