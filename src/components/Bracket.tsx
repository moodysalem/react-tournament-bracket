import * as React from 'react';
import * as _ from 'underscore';
import winningPathLength from '../util/winningPathLength';
import BracketGame from './BracketGame';
import { Game, Side } from './model';

export interface LineInfo {
  yOffset: number;
  separation: number;
  homeVisitorSpread: number;
}

export interface GameComponentProps {
  game: Game;
  x: number;
  y: number;
  homeOnTop: boolean;
}

export type GameComponent = React.ComponentType<GameComponentProps>;

interface BracketGamesFunctionProps {
  game: Game;
  x: number;
  y: number;
  gameDimensions: { width: number; height: number; }
  roundSeparatorWidth: number;
  round: number;
  homeOnTop: boolean;
  lineInfo: LineInfo;
  GameComponent: GameComponent;
}

const toBracketGames = ({ GameComponent, game, x, y, gameDimensions, roundSeparatorWidth, round, lineInfo, homeOnTop, ...rest }: BracketGamesFunctionProps): JSX.Element[] => {
  const { width: gameWidth, height: gameHeight } = gameDimensions;

  const ySep = gameHeight * Math.pow(2, round - 2);

  return [
    <g key={`${game.id}-${y}`}>
      <GameComponent
        {...rest} {...gameDimensions}
        key={game.id} homeOnTop={homeOnTop} game={game} x={x} y={y}/>
    </g>
  ].concat(
    _.chain(game.sides)
      .map((sideInfo, side: Side) => ({ ...sideInfo, side }))
      // filter to the teams that come from winning other games
      .filter(({ seed }) => seed && seed.sourceGame !== null && seed.rank === 1)
      .map(
        ({ seed: { sourceGame }, side }) => {
          // we put visitor teams on the bottom
          const isTop = side === Side.HOME ? homeOnTop : !homeOnTop;
          const multiplier = isTop ? -1 : 1;

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
                  GameComponent,
                  game: sourceGame,
                  homeOnTop: homeOnTopState,
                  lineInfo,
                  gameDimensions,
                  roundSeparatorWidth,
                  x: x - gameWidth - roundSeparatorWidth,
                  y: y + ((ySep / 2) * multiplier),
                  round: round - 1,
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

export interface BracketProps {
  game: Game;
  GameComponent?: GameComponent;
  homeOnTop?: boolean;
  gameDimensions?: {
    height: number;
    width: number;
  };
  svgPadding?: number;
  roundSeparatorWidth?: number;
  lineInfo?: LineInfo;
}

/**
 * Displays the bracket that culminates in a particular finals game
 */
export default class Bracket extends React.Component<BracketProps> {
  static defaultProps: Partial<BracketProps> = {
    GameComponent: BracketGame,

    homeOnTopState: true,

    gameDimensions: {
      height: 80,
      width: 200
    },

    svgPadding: 20,
    roundSeparatorWidth: 24,

    lineInfo: {
      yOffset: -6,
      separation: 6,
      homeVisitorSpread: 11
    }
  };

  render() {
    const { GameComponent, game, gameDimensions, svgPadding, roundSeparatorWidth, homeOnTop, lineInfo, children, ...rest } = this.props;

    const numRounds = winningPathLength(game);

    const svgDimensions = {
      height: (gameDimensions.height * Math.pow(2, numRounds - 1)) + svgPadding * 2,
      width: (numRounds * (gameDimensions.width + roundSeparatorWidth)) + svgPadding * 2
    };

    return (
      <svg {...svgDimensions}>
        <g>
          {
            toBracketGames({
              GameComponent,
              gameDimensions,
              roundSeparatorWidth,
              game,
              round: numRounds,
              homeOnTop: homeOnTopState,
              lineInfo,
              // svgPadding away from the right
              x: svgDimensions.width - svgPadding - gameDimensions.width,
              // vertically centered first game
              y: (svgDimensions.height / 2) - gameDimensions.height / 2,

              ...rest
            })
          }
        </g>
      </svg>
    );
  }
}