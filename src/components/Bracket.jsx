import React, { PropTypes, PureComponent } from 'react';
import _ from 'underscore';
import BracketGame from './BracketGame';
import GameShape from './GameShape';
import cx from 'classnames';
import winningPathLength from '../util/winningPathLength';
import controllable from 'react-controllables';

const toBracketGames = ({ game, x, y, gameDimensions, roundSeparatorWidth, round, lineInfo, onClickGame, ...rest }) => {
  const { width: gameWidth, height: gameHeight } = gameDimensions;

  const ySep = gameHeight * Math.pow(2, round - 2);

  return [
    <g key={`${game.id}-${y}`}>
      <BracketGame {...gameDimensions} {...rest} key={game.id} game={game} x={x} y={y}
                   onClick={onClickGame ? () => onClickGame(game) : null}
                   className={cx({ 'cursor-pointer': onClickGame !== null })}/>
    </g>
  ].concat(
    _.chain(game.sides)
      .map((obj, side) => ({ ...obj, side }))
      // filter to the teams that come from winning other games
      .filter(({ seed }) => seed && seed.sourceGame != null && seed.rank == 1)
      .map(
        ({ seed: { sourceGame }, side }) => {
          // we put visitor teams on the bottom
          const isVisitor = side === 'visitor',
            multiplier = isVisitor ? 1 : -1;

          const pathInfo = [
            `M${x - lineInfo.separation} ${y + gameHeight / 2 + lineInfo.yOffset + multiplier * lineInfo.homeVisitorSpread}`,
            `H${x - (roundSeparatorWidth / 2)}`,
            `V${y + gameHeight / 2 + lineInfo.yOffset + ((ySep / 2) * multiplier)}`,
            `H${x - roundSeparatorWidth + lineInfo.separation}`
          ];

          return [
            <path key={`${game.id}-${side}-${y}-path`} d={pathInfo.join(' ')} fill="transparent" stroke="black"/>
          ]
            .concat(
              toBracketGames(
                {
                  game: sourceGame,
                  lineInfo,
                  gameDimensions,
                  roundSeparatorWidth,
                  x: x - gameWidth - roundSeparatorWidth,
                  y: y + ((ySep / 2) * multiplier),
                  round: round - 1,
                  onClickGame,
                  ...rest
                }
              )
            );
        }
      )
      .flatten(true)
      .value()
  );
};

/**
 * Displays the bracket that culminates in a particular finals game
 */
class Bracket extends PureComponent {
  static propTypes = {
    game: GameShape.isRequired,

    hoveredTeamId: PropTypes.string,
    onHoveredTeamIdChange: PropTypes.func.isRequired,

    onClickGame: PropTypes.func,

    gameDimensions: PropTypes.shape(
      {
        height: PropTypes.number.isRequired,
        width: PropTypes.number.isRequired
      }
    ).isRequired,

    svgPadding: PropTypes.number.isRequired,

    lineInfo: PropTypes.shape(
      {
        yOffset: PropTypes.number.isRequired,
        separation: PropTypes.number.isRequired,
        homeVisitorSpread: PropTypes.number.isRequired
      }
    ).isRequired
  };

  static defaultProps = {
    hoveredTeamId: null,

    onClickGame: null,

    gameDimensions: {
      height: 68,
      width: 200
    },

    svgPadding: 20,
    roundSeparatorWidth: 24,

    lineInfo: {
      yOffset: -12,
      separation: 6,
      homeVisitorSpread: 12
    }
  };

  render() {
    const { game, gameDimensions, svgPadding, roundSeparatorWidth, ...rest } = this.props;

    const numRounds = winningPathLength(game);

    const svgDimensions = {
      height: (gameDimensions.height * Math.pow(2, numRounds - 1)) + svgPadding * 2,
      width: (numRounds * (gameDimensions.width + roundSeparatorWidth)) + svgPadding * 2
    };

    return (
      <svg {...svgDimensions}>
        <g>
          {
            toBracketGames(
              {
                gameDimensions,
                roundSeparatorWidth,
                game,
                round: numRounds,
                // svgPadding away from the right
                x: svgDimensions.width - svgPadding - gameDimensions.width,
                // vertically centered first game
                y: (svgDimensions.height / 2) - gameDimensions.height / 2,

                ...rest
              }
            )
          }
        </g>
      </svg>
    );
  }
}

export default controllable(Bracket, ['hoveredTeamId']);