'use strict';

const GAMES = JSOG.decode(DEMO_DATA);
const ROOT = _.findWhere(GAMES, { id: '35b0745d-ef13-4255-8c40-c9daa95e4cc4' });

const { Bracket, BracketGame, BracketGenerator } = ReactTournamentBracket;

class App extends React.PureComponent {
  state = {
    homeOnTop: true,
    hoveredTeamId: null
  };

  changeHoveredTeamId = hoveredTeamId => this.setState({ hoveredTeamId });

  handleClick = game => alert('clicked game: ' + game.name);

  gameComponent = props => {
    return (
      <BracketGame
        {...props}
        onHoveredTeamIdChange={hoveredTeamId => this.setState({ hoveredTeamId })}
        onClick={() => this.handleClick(props.game)}
        hoveredTeamId={this.state.hoveredTeamId}/>
    );
  };

  render() {
    const { homeOnTop, hoveredTeamId } = this.state;
    const { gameComponent: GameComponent } = this;

    return (
      <div>
        <h3>Configuration</h3>
        <ul>
          <li>
            <label style={{ cursor: 'pointer', userSelect: 'none' }}>
              Home On Top
              <input type="checkbox" style={{ marginLeft: 8 }}
                     onChange={({ target: { checked: homeOnTop } }) => this.setState({ homeOnTop })}
                     checked={homeOnTop}/>
            </label>
          </li>
        </ul>

        <h3>BracketGame</h3>
        <p>The core element in rendering the data is the <code>BracketGame</code> component</p>
        <GameComponent game={ROOT} homeOnTop={homeOnTop}/>

        <h3>Bracket</h3>
        <p>
          The bracket is rendered using a <code>Bracket</code> component, which takes the final game of the
          bracket. The game shape is a graph, so a single game should contain all the information required
          to render the bracket.
        </p>
        <Bracket game={ROOT} homeOnTop={homeOnTop} GameComponent={GameComponent}/>

        <h3>BracketGenerator</h3>
        <p>
          The <code>BracketGenerator</code> component takes an array of games and renders a separate
          <code>Bracket</code> for each root game.
          It also places each <code>Bracket</code> in mobile friendly parent <code>div</code>s and
          synchronizes the highlighted teams across brackets.
        </p>
        <BracketGenerator GameComponent={GameComponent} games={GAMES} homeOnTop={homeOnTop}/>
      </div>
    );
  }
}

ReactDOM.render(<App/>, document.getElementById('app'));