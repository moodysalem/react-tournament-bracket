import _ from 'underscore';

export default function winningPathLength(game, visited = {}) {
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
            ({ seed }) => (seed != null && seed.sourceGame != null && seed.rank == 1) ?
              winningPathLength(seed.sourceGame, visited) : 0
          )
        ) :
        0
    )
  );
};