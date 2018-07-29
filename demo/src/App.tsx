import * as JSOG from 'jsog';
import * as React from 'react';
import * as _ from 'underscore';
import DEMO_DATA from './demo-data';
import { Bracket, BracketGame, BracketGenerator, Model } from 'react-tournament-bracket';

const GAMES = JSOG.decode(DEMO_DATA);
const ROOT: any = _.findWhere(GAMES, { id: '35b0745d-ef13-4255-8c40-c9daa95e4cc4' });

export default class App extends React.PureComponent {
  public state = {
    homeOnTopState: true,
    hoveredTeamId: null
  };

  public render() {
    const { homeOnTopState } = this.state;
    const { gameComponent: GameComponent } = this;

    return (
      <div>
        <h3>Configuration</h3>
        <ul>
          <li>
            <label style={{ cursor: 'pointer', userSelect: 'none' }}>
              Home On Top
              <input type="checkbox" style={{ marginLeft: 8 }}
                     onChange={({ target: { checked } }) => this.setState({ homeOnTopState: checked })}
                     checked={homeOnTopState}/>
            </label>
          </li>
        </ul>

        <h3>BracketGame</h3>
        <p>The core element in rendering the data is the <code>BracketGame</code> component</p>
        <GameComponent game={ROOT} homeOnTop={homeOnTopState}/>

        <h3>Bracket</h3>
        <p>
          The bracket is rendered using a <code>Bracket</code> component, which takes the final game of the
          bracket. The game shape is a graph, so a single game should contain all the information required
          to render the bracket.
        </p>
        <Bracket game={ROOT} homeOnTop={homeOnTopState} GameComponent={GameComponent}/>

        <h3>BracketGenerator</h3>
        <p>
          The <code>BracketGenerator</code> component takes an array of games and renders a separate
          <code>Bracket</code> for each root game.
          It also places each <code>Bracket</code> in mobile friendly parent <code>div</code>s and
          synchronizes the highlighted teams across brackets.
        </p>
        <BracketGenerator GameComponent={GameComponent} games={GAMES} homeOnTop={homeOnTopState}/>
      </div>
    );
  }

  private changeHoveredTeamId = (hoveredTeamId: string) => this.setState({ hoveredTeamId });

  private handleClick = (game: Model.Game) => alert('clicked game: ' + game.name);

  private gameComponent = (props: any) => {
    return (
      <BracketGame
        {...props}
        onHoveredTeamIdChange={this.changeHoveredTeamId}
        onClick={this.handleClick.bind(this, props.game)}
        hoveredTeamId={this.state.hoveredTeamId}/>
    );
  };
}