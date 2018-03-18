# [![npm](https://img.shields.io/npm/v/react-tournament-bracket.svg)](https://www.npmjs.com/package/react-tournament-bracket) [![Build Status](https://travis-ci.org/moodysalem/react-tournament-bracket.svg?branch=gh-pages)](https://travis-ci.org/moodysalem/react-tournament-bracket) react-tournament-bracket
![image](http://i.imgur.com/M3nJsRF.png "Example Bracket")

React components for rendering a tournament bracket

# Demo
Go [here](https://moodysalem.github.io/react-tournament-bracket/)

# Install
```
npm i react-tournament-bracket 
```

# Usage
```jsx
import {Bracket} from 'react-tournament-bracket';
import {render} from 'react-dom';

render(<Bracket game={game}/>, document.getElementById('app'));
```

# Props
## [GameShape](https://github.com/moodysalem/react-tournament-bracket/blob/gh-pages/src/components/GameShape.jsx#L40)
## [BracketGame](https://github.com/moodysalem/react-tournament-bracket/blob/gh-pages/src/components/BracketGame.jsx#L9)
## [Bracket](https://github.com/moodysalem/react-tournament-bracket/blob/gh-pages/src/components/Bracket.jsx#L66)
## [BracketGenerator](https://github.com/moodysalem/react-tournament-bracket/blob/gh-pages/src/components/BracketGenerator.jsx#L69)

# TODO
* Component documentation
* Better handling of mouse team highlighting (currently, when moving between teams in a particular game, the mouse events fire in inconsistent order and can result in the wrong team left highlighted)
* Consider simplifying the game model passed to this component
* Add tests
