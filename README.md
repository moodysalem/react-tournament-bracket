# react-tournament-bracket
![image](http://i.imgur.com/l02SBUl.png "Example Image")

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
