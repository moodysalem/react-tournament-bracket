import * as React from 'react';
import { CSSProperties } from 'react';
import * as _ from 'underscore';
import Bracket, { BracketProps } from './Bracket';
import winningPathLength from '../util/winningPathLength';
import { Game } from './model';

const makeFinals = ({ games }: { games: Game[] }): Array<{ game: Game, height: number }> => {
  const isInGroup = (() => {
    const gameIdHash: { [ id: string ]: true } =
      _.reduce(games, ({ id }: Game, memo) => ({ ...memo, [ id ]: true }), {});

    return (id: string) => (gameIdHash[ id ] === true);
  })();

  const gamesFeedInto = _.map(
    games,
    game => ({
      ...game,
      feedsInto: _.filter(
        games,
        ({ id, sides }) => (
          isInGroup(id) &&
          _.any(
            sides,
            ({ seed }) => seed && seed.sourceGame !== null && seed.rank === 1 && seed.sourceGame.id === game.id
          )
        )
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

// We need this to remove game from the bracket props - unfortunately it's copy pasted from here:
// http://ideasintosoftware.com/typescript-advanced-tricks/
export type Diff<T extends string, U extends string> = ({[P in T]: P } & {[P in U]: never } & { [ x: string ]: never })[T];
export type Omit<T, K extends keyof T> = Pick<T, Diff<keyof T, K>>;

export interface BracketGeneratorProps extends Omit<BracketProps, 'game'> {
  games: Game[];
  titleComponent?: React.ComponentClass<{ game: Game; height: number; }>;
  style?: CSSProperties;
}

/**
 * Displays the brackets for some set of games sorted by bracket height
 */
export default class BracketGenerator extends React.Component<BracketGeneratorProps, { finals: Array<{ game: Game; height: number; }> }> {
  static defaultProps = {
    titleComponent: BracketTitle
  };

  state = {
    finals: makeFinals({ games: this.props.games })
  };

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
                <TitleComponent game={game} height={height}/>
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