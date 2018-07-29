# [![npm](https://img.shields.io/npm/v/react-tournament-bracket.svg)](https://www.npmjs.com/package/react-tournament-bracket) [![Build Status](https://travis-ci.org/moodysalem/react-tournament-bracket.svg?branch=gh-pages)](https://travis-ci.org/moodysalem/react-tournament-bracket) react-tournament-bracket
![image](http://i.imgur.com/M3nJsRF.png "Example Bracket")

React components for rendering a tournament bracket

## Demo
Go [here](https://moodysalem.github.io/react-tournament-bracket/)

## Install
```
npm i react-tournament-bracket 
```

## Usage
These bracket components rely on a cyclical graph data structure.   
Thus, to render a bracket, you pass in only the final game.
If you have a set of games matching the model, you can pass them all in
to render all the brackets. The Bracket Generator will discover which games
are considered 'finals' and order the rendered brackets by the height of the
winning path.

```jsx
import { Bracket } from 'react-tournament-bracket';
import { render } from 'react-dom';

render(<Bracket game={game}/>, document.getElementById('app'));
```

# Development

# TODO
* Component documentation
* Better handling of mouse team highlighting (currently, when moving between teams in a particular game, the mouse events fire in inconsistent order and can result in the wrong team left highlighted)
* Consider simplifying the game model passed to this component
* Add tests
