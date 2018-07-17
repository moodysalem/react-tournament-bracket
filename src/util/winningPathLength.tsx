import * as _ from 'underscore';
import Game from '../models/Game';

export default function winningPathLength(game: Game, visited: { [ id: string ]: true } = {}): number {
  if (visited[ game.id ]) {
    return 0;
  }

  visited[ game.id ] = true;

  return (
    1 + (
      _.keys(game.sides).length > 0 ?
        Math.max.apply(
          Math,
          _.map(
            game.sides,
            ({ seed }) => (seed && seed.sourceGame && seed.rank === 1) ?
              winningPathLength(seed.sourceGame, visited) : 0
          )
        ) :
        0
    )
  );
};