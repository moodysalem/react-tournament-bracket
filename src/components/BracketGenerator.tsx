import * as React from 'react';
import { CSSProperties } from 'react';
import * as _ from 'underscore';
import Game from '../models/Game';
import winningPathLength from '../util/winningPathLength';
import Bracket, { BracketProps } from './Bracket';
import {BracketTitle} from './BracketTitle';

const makeFinals = ({ games }: { games: Game[] }): Array<{ game: Game, height: number }> => {
  const isInGroup = (() => {
    const gameIdHash: { [ id: string ]: true } =
    games.reduce(({ id }: Game, memo) => ({ ...memo, [ id ]: true }), {});
    return (id: string) => (gameIdHash[ id ] === true);
  })();

  const gamesFeedInto = games.map(
      (game) => ({
      ...game,
      feedsInto: games.filter(
        ({ id, sides}) => {
          return isInGroup(id);

          // TODO: resolve this (used to be included on the filter)
          // && _.any(
          //   sides,
          //   ({ seed }) => seed !== null && seed.sourceGame !== null && seed.rank === 1 && seed.sourceGame.id === game.id
          // )
        }
      )
    })
  );

  return _.chain(gamesFeedInto)
  // get the games that don't feed into anything else in the group, i.e. finals for this game group
    .filter(({ feedsInto }) => feedsInto.length === 0)
    .map(
      // get their heights
      game => ({
        game,
        height: winningPathLength(game)
      })
    )
    // render the tallest bracket first
    .sortBy(({ height }) => height * -1)
    .value();
};



export interface BracketGeneratorProps extends BracketProps {
  games: Game[];
  titleComponent?: React.ComponentClass<{ game: Game; height: number; }>;
  style?: CSSProperties;
}

interface BracketGeneratorState {
  finals: Array<{ game: Game, height: number }>
}

/**
 * Displays the brackets for some set of games sorted by bracket height
 */
export default class BracketGenerator extends React.Component<BracketGeneratorProps, BracketGeneratorState> {

  static defaultProps = {
    titleComponent: BracketTitle
  };

  constructor(props: BracketGeneratorProps) {
    super(props);
    this.state = {
        finals: makeFinals({ games: this.props.games })
    };
  }

  componentWillReceiveProps({ games }: BracketGeneratorProps) {
    if (games !== this.props.games) {
      this.setState({ finals: makeFinals({ games }) });
    }
  }

  render() {
    const { games, titleComponent: TitleComponent, style, ...rest } = this.props;
    const { finals } = this.state;

    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', ...style }}>
        {
          _.map(
            finals,
            ({ game, height }) => (
              <div key={game.id} style={{ textAlign: 'center', flexGrow: 1, maxWidth: '100%' }}>
                <BracketTitle game={game} height={height}/>
                <div style={{ maxWidth: '100%', overflow: 'auto', WebkitOverflowScrolling: 'touch' }}>
                  <Bracket game={game} {...rest}/>
                </div>
              </div>
            )
          )
        }
      </div>
    );
  }
}