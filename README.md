# [![npm](https://img.shields.io/npm/v/react-tournament-bracket.svg)](https://www.npmjs.com/package/react-tournament-bracket) [![Build Status](https://travis-ci.org/moodysalem/react-tournament-bracket.svg?branch=master)](https://travis-ci.org/moodysalem/react-tournament-bracket) react-tournament-bracket
![image](http://i.imgur.com/M3nJsRF.png "Example Bracket")

React components for rendering a tournament bracket

# Demo
Go [here](https://moodysalem.com/react-tournament-bracket/)

# Install
```
yarn add react-tournament-bracket 
```

# Usage
```jsx
import {Bracket} from 'react-tournament-bracket';
import {render} from 'react-dom';

render(<Bracket game={game}/>, document.getElementById('app'));
```

# TODO
* Component documentation
* Better handling of mouse team highlighting (currently, when moving between teams in a particular game, the mouse events fire in inconsistent order and can result in the wrong team left highlighted)
* Consider simplifying the game model passed to this component
* Add tests
