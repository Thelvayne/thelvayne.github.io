import React from 'react'
import Game from '..model/gotagame'

class GameofAmazons extends React.Component {
    state ={
        gameState: new Game(this.props.isWhite),
        WhiteNoPossibleMoves: false,
        BlackNoPossibleMoves: false
    }
    render(){
        return{
            /**
             * <div >
             *  <stage>
             *      <layer>
             * </div>
             */
        }
    }
}
export default GameofAmazons