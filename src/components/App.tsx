import * as React from 'react';
import DemoData from '../models/DemoData';
import BracketGenerator from './BracketGenerator';
import '../stylesheets/App.css';

class App extends React.Component {
  render() {
    return (
        <div className="container">
            <h1 className="page-header">React Tournament Bracket</h1>

            <p className="lead">
                This set of components is useful for rendering tournament bracket structures. Transform your data into the
                required game shape, and then pass it to the bracket generator for easy rendering.
            </p>

            <div id="app">
                <BracketGenerator/>
            </div>
        </div>
    );
  }
}

export default App;
