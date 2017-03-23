import React, { PropTypes, PureComponent } from "react";
import _ from "underscore";
import Bracket from "./Bracket";
import winningPathLength from "../util/winningPathLength";
import GameShape from "./GameShape";
import controllable from "react-controllables";

const makeFinals = ({ games }) => {
  const isInGroup = (() => {
    const gameIdHash = _.chain(games).indexBy('id').mapObject(val => 1).value();
    return id => Boolean(gameIdHash[ id ]);
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
            ({ seed }) => seed !== null && seed.sourceGame !== null && seed.rank === 1 && seed.sourceGame.id === game.id
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
class BracketTitle extends PureComponent {
  static propTypes = {
    game: GameShape.isRequired,
    height: PropTypes.number.isRequired
  };

  render() {
    const { game, height } = this.props;

    return (
      <h3 style={{ textAlign: 'center' }}>
        {game.bracketLabel || game.name} ({height} {height === 1 ? 'round' : 'rounds'})
      </h3>
    );
  }
}

/**
 * Displays the brackets for some set of games sorted by bracket height
 */
class BracketGenerator extends PureComponent {
  static propTypes = {
    games: PropTypes.arrayOf(GameShape).isRequired,

    titleComponent: PropTypes.func,

    hoveredTeamId: PropTypes.string,
    onHoveredTeamIdChange: PropTypes.func.isRequired,
    onClickGame: PropTypes.func
  };

  static defaultProps = {
    hoveredTeamId: null,
    onClickGame: null,
    titleComponent: BracketTitle
  };

  state = {
    finals: makeFinals({ games: this.props.games })
  };

  componentWillReceiveProps({ games }) {
    if (games !== this.props.games) {
      this.setState({ finals: makeFinals({ games }) });
    }
  }

  render() {
    const { games, titleComponent: TitleComponent, style, ...rest } = this.props,
      { finals } = this.state;

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


export default controllable(BracketGenerator, [ 'hoveredTeamId' ]);