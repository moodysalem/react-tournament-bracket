import * as  React from 'react';
import { RectClipped } from './Clipped';
import { Game, Side, SideInfo } from './model';
import * as controllable from 'react-controllables';
import * as _ from 'underscore';

interface BracketGameProps {
  game: Game;

  homeOnTop?: boolean;
  hoveredTeamId?: string | null;

  onHoveredTeamIdChange: (id: string) => void;
  styles?: {
    backgroundColor: string;
    hoverBackgroundColor: string;
    scoreBackground: string;
    winningScoreBackground: string;
    teamNameStyle: React.CSSProperties;
    teamScoreStyle: React.CSSProperties;
    gameNameStyle: React.CSSProperties;
    gameTimeStyle: React.CSSProperties;
    teamSeparatorStyle: React.CSSProperties;
  };
  topText?: (game: Game) => string;
  bottomText?: (game: Game) => string;
}

class BracketGame extends React.PureComponent<BracketGameProps> {
  static defaultProps: Partial<BracketGameProps> = {
    homeOnTopState: true,
    hoveredTeamId: null,

    styles: {
      backgroundColor: '#58595e',
      hoverBackgroundColor: '#222',

      scoreBackground: '#787a80',
      winningScoreBackground: '#ff7324',
      teamNameStyle: { fill: '#fff', fontSize: 12, textShadow: '1px 1px 1px #222' },
      teamScoreStyle: { fill: '#23252d', fontSize: 12 },
      gameNameStyle: { fill: '#999', fontSize: 10 },
      gameTimeStyle: { fill: '#999', fontSize: 10 },
      teamSeparatorStyle: { stroke: '#444549', strokeWidth: 1 }
    },

    topText: ({ scheduled }: Game) => new Date(scheduled).toLocaleDateString(),
    bottomText: ({ name, bracketLabel }: Game) => _.compact([ name, bracketLabel ]).join(' - ')
  };

  render() {
    const {
      game,

      hoveredTeamId,
      onHoveredTeamIdChange,

      styles: {
        backgroundColor,
        hoverBackgroundColor,
        scoreBackground,
        winningScoreBackground,
        teamNameStyle,
        teamScoreStyle,
        gameNameStyle,
        gameTimeStyle,
        teamSeparatorStyle
      },

      homeOnTop,

      topText, bottomText,

      ...rest
    } = this.props;

    const { sides } = game;


    const top = sides[ homeOnTop ? Side.HOME : Side.VISITOR ];
    const bottom = sides[ homeOnTop ? Side.VISITOR : Side.HOME ];

    const winnerBackground = (top && bottom && top.score && bottom.score && top.score.score !== bottom.score.score) ?
      (
        top.score.score > bottom.score.score ?
          <rect x="170" y="12" width="30" height="22.5" style={{ fill: winningScoreBackground }} rx="3" ry="3"/> :
          <rect x="170" y="34.5" width="30" height="22.5" style={{ fill: winningScoreBackground }} rx="3" ry="3"/>
      ) :
      null;

    interface SideComponentProps {
      x: number;
      y: number;
      side: SideInfo;
      onHover: (id: string | null) => void
    }

    const SideComponent = ({ x, y, side, onHover }: SideComponentProps) => {
      const tooltip = side.seed && side.team ? <title>{side.seed.displayName}</title> : null;

      return (
        <g onMouseEnter={() => onHover(side && side.team ? side.team.id : null)} onMouseLeave={() => onHover(null)}>
          {/* trigger mouse events on the entire block */}
          <rect x={x} y={y} height={22.5} width={200} fillOpacity={0}>
            {tooltip}
          </rect>

          <RectClipped x={x} y={y} height={22.5} width={165}>
            <text x={x + 5} y={y + 16}
                  style={{ ...teamNameStyle, fontStyle: side.seed && side.seed.sourcePool ? 'italic' : null }}>
              {tooltip}
              {side.team ? side.team.name : (side.seed ? side.seed.displayName : null)}
            </text>
          </RectClipped>

          <text x={x + 185} y={y + 16} style={teamScoreStyle} textAnchor="middle">
            {side.score ? side.score.score : null}
          </text>
        </g>
      );
    };

    const topHovered = (top && top.team && top.team.id === hoveredTeamId),
      bottomHovered = (bottom && bottom.team && bottom.team.id === hoveredTeamId);

    return (
      <svg width="200" height="82" viewBox="0 0 200 82" {...rest}>
        {/* game time */}
        <text x="100" y="8" textAnchor="middle" style={gameTimeStyle}>
          {topText(game)}
        </text>

        {/* backgrounds */}

        {/* base background */}
        <rect x="0" y="12" width="200" height="45" fill={backgroundColor} rx="3" ry="3"/>

        {/* background for the top team */}
        <rect x="0" y="12" width="200" height="22.5" fill={topHovered ? hoverBackgroundColor : backgroundColor} rx="3"
              ry="3"/>
        {/* background for the bottom team */}
        <rect x="0" y="34.5" width="200" height="22.5" fill={bottomHovered ? hoverBackgroundColor : backgroundColor}
              rx="3" ry="3"/>

        {/* scores background */}
        <rect x="170" y="12" width="30" height="45" fill={scoreBackground} rx="3" ry="3"/>

        {/* winner background */}
        {winnerBackground}

        {/* the players */}
        {
          top ? (
            <SideComponent x={0} y={12} side={top} onHover={onHoveredTeamIdChange}/>
          ) : null
        }

        {
          bottom ? (
            <SideComponent x={0} y={34.5} side={bottom} onHover={onHoveredTeamIdChange}/>
          ) : null
        }

        <line x1="0" y1="34.5" x2="200" y2="34.5" style={teamSeparatorStyle}/>

        {/* game name */}
        <text x="100" y="68" textAnchor="middle" style={gameNameStyle}>
          {bottomText(game)}
        </text>
      </svg>
    );
  }
}

export default controllable(BracketGame, [ 'hoveredTeamId' ]);