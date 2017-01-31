import { PropTypes } from 'react';

// for nested proptypes
const lazyFunction = f => ((...args) => f().apply(this, args));

let GameShape;

export const HOME = 'home';
export const VISITOR = 'visitor';

const ID_TYPE = PropTypes.string;

const TeamShape = PropTypes.shape(
  {
    score: PropTypes.shape(
      {
        score: PropTypes.number.isRequired
      }
    ),

    seed: PropTypes.shape(
      {
        displayName: PropTypes.string.isRequired,
        rank: PropTypes.number.isRequired,
        sourceGame: lazyFunction(() => GameShape),
        sourcePool: PropTypes.object
      }
    ),

    team: PropTypes.shape(
      {
        id: ID_TYPE,
        name: PropTypes.string.isRequired
      }
    )
  }
);

GameShape = PropTypes.shape(
  {
    id: ID_TYPE,
    name: PropTypes.string.isRequired,
    sides: PropTypes.shape(
      {
        [HOME]: TeamShape,
        [VISITOR]: TeamShape
      }
    ).isRequired
  }
);

export default GameShape;