import * as React from 'react';
import Game from '../models/Game';

/**
 * The default title component used for each bracket, receives the game and the height of the bracket
 */
export class BracketTitle extends React.PureComponent<{ game: Game; height: number; }> {
    render() {
        const { game, height } = this.props;

        return (
            <h3 style={{ textAlign: 'center' }}>
                {game.bracketLabel || game.name} ({height} {height === 1 ? 'round' : 'rounds'})
            </h3>
        );
    }
}