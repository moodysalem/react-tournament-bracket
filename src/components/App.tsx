import {JsogService} from 'jsog-typescript';
import * as React from 'react';
import * as _ from 'underscore';
import DemoData from '../models/DemoData';
import '../stylesheets/App.css';
// import Bracket from './Bracket';
import BracketGame from './BracketGame';
import BracketGenerator from './BracketGenerator';

const jsog = new JsogService();

const GAMES = jsog.deserializeObject(DemoData);
const ROOT = _.findWhere(GAMES, {id: '35b0745d-ef13-4255-8c40-c9daa95e4cc4'});


interface AppState {
    homeOnTop: boolean,
    hoveredTeamId: any
}

class App extends React.Component<{}, AppState> {
    constructor(props: any) {
        super(props);
        this.state = {
            homeOnTop: true,
            hoveredTeamId: null
        }
    }

    render() {
        const {gameComponent: GameComponent} = this;
        const {homeOnTop} = this.state;
        const inputOnChange = (event: any) => {
            this.setState({homeOnTop: event.target.checked});
        };

        return (
            <div>
                <h3>Configuration</h3>
                <ul>
                    <li>
                        <label style={{cursor: 'pointer', userSelect: 'none'}}>
                            Home On Top
                            <input type="checkbox"
                                   style={{marginLeft: 8}}
                                   onChange={inputOnChange}
                                   checked={homeOnTop}/>
                        </label>
                    </li>
                </ul>

                <h3>BracketGame</h3>
                <p>The core element in rendering the data is the <code>BracketGame</code> component</p>
                <GameComponent game={ROOT} homeOnTop={homeOnTop}/>

                {/*<h3>Bracket</h3>*/}
                {/*<p>*/}
                    {/*The bracket is rendered using a <code>Bracket</code> component, which takes the final game of the*/}
                    {/*bracket. The game shape is a graph, so a single game should contain all the information required*/}
                    {/*to render the bracket.*/}
                {/*</p>*/}
                {/*<Bracket game={ROOT} homeOnTop={homeOnTop} GameComponent={GameComponent}/>*/}

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

    private _handleClick = (game: any) => alert(`clicked game: ${game.name}`);

    private gameComponent = (props: any) => {
        const gameComponentOnClick = () => this._handleClick(props.game);
        const gameComponentOnHoveredTeamIdChange = (hoveredTeamId: any) => this.setState({hoveredTeamId});

        return (
            <BracketGame
                {...props}
                onHoveredTeamIdChange={gameComponentOnHoveredTeamIdChange}
                onClick={gameComponentOnClick}
                hoveredTeamId={this.state.hoveredTeamId}/>
        );
    };
}

export default App;
