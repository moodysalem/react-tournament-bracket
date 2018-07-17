import * as React from 'react';
import * as _ from 'underscore';
import {Game, Side} from '../models/models';
import winningPathLength from '../util/winningPathLength';
import BracketGame from './BracketGame';

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

const toBracketGames = ({
    GameComponent,
    game,
    x,
    y,
    gameDimensions,
    roundSeparatorWidth,
    round,
    lineInfo,
    homeOnTop,
    ...rest }: BracketGamesFunctionProps): JSX.Element[] => {
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
      .filter((seed: any) => {
        return seed && seed.sourceGame !== null && seed.rank === 1
      })
      .map(
        (tuple: any) => {
          // we put visitor teams on the bottom
          const isTop = tuple.side === Side.HOME ? homeOnTop : !homeOnTop;
          const multiplier = isTop ? -1 : 1;
          const pathInfo = [
            `M${x - lineInfo.separation} ${y + gameHeight / 2 + lineInfo.yOffset + multiplier * lineInfo.homeVisitorSpread}`,
            `H${x - (roundSeparatorWidth / 2)}`,
            `V${y + gameHeight / 2 + lineInfo.yOffset + ((ySep / 2) * multiplier)}`,
            `H${x - roundSeparatorWidth + lineInfo.separation}`
          ];

          return [
            <path key={`${game.id}-${tuple.side}-${y}-path`} d={pathInfo.join(' ')} fill="transparent" stroke="black"/>
          ]
            .concat(
              toBracketGames(
                {
                    GameComponent,
                    game: tuple.seed.sourceGame,
                    gameDimensions,
                    homeOnTop,
                    lineInfo,
                    round: round - 1,
                    roundSeparatorWidth,
                    x: x - gameWidth - roundSeparatorWidth,
                    y: y + ((ySep / 2) * multiplier),
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
  GameComponent?: GameComponent;
  gameDimensions?: {
    height: number;
    width: number;
  };
  roundSeparatorWidth?: number;
  game: Game;
  homeOnTop?: boolean;
  lineInfo?: LineInfo;
  svgPadding?: number;
}

/**
 * Displays the bracket that culminates in a particular finals game
 */
export default class Bracket extends React.Component<BracketProps, {}> {
  constructor(props: BracketProps) {
      super(props);
  }

  render() {
    // Setup property assignments with defaults:
    const gameDimensions = this.props.gameDimensions || {height: 80, width: 200};
    const GameComponent = this.props.GameComponent || BracketGame;
    const game = this.props.game;
    const svgPadding = this.props.svgPadding || 20;
    const roundSeparatorWidth = this.props.roundSeparatorWidth || 24;
    const homeOnTop = this.props.homeOnTop || true;
    const lineInfo = this.props.lineInfo || {yOffset: -6, separation: 6, homeVisitorSpread: 11};
    const {...rest} = this.props;
    const numRounds = winningPathLength(game);

    const svgDimensions = {
      height: (gameDimensions.height * Math.pow(2, numRounds - 1)) + svgPadding * 2,
      width: (numRounds * (gameDimensions.width + roundSeparatorWidth)) + svgPadding * 2
    };

    const properties: any = {
        GameComponent,
        game,
        gameDimensions,
        homeOnTop,
        lineInfo,
        round: numRounds,
        roundSeparatorWidth,
        // svgPadding away from the right
        x: svgDimensions.width - svgPadding - gameDimensions.width,
        // vertically centered first game
        y: (svgDimensions.height / 2) - gameDimensions.height / 2,
        ...rest
    };

    return (
      <svg {...svgDimensions}>
        <g>
          {
            toBracketGames(properties)
          }
        </g>
      </svg>
    );
  }
}