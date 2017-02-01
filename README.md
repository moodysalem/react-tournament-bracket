# [![npm](https://img.shields.io/npm/v/react-tournament-bracket.svg)](https://www.npmjs.com/package/react-tournament-bracket) [![Build Status](https://travis-ci.org/moodysalem/react-tournament-bracket.svg?branch=master)](https://travis-ci.org/moodysalem/react-tournament-bracket) react-tournament-bracket
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

# Flexbox by the bracket generator
The bracket generator uses flexbox classes provided by [flexbox-css](https://github.com/moodysalem/flexbox-css) to wrap its generated brackets. If you are using the bracket generator, you should include the flexbox-css, e.g.:

```html
<link rel="stylesheet" href="https://cdn.rawgit.com/moodysalem/flexbox-css/e5a121cb493c0452509708a9fb0524c671f31b4e/dist/flexbox-css-min.css" integrity="sha384-W3cb5bRHJiWSSwBvBHgWXGH8SdPZU6tA7DAa0S0JHJdvRlBqeKWBya2Lu9zrUMXK" crossorigin="anonymous">
```

# TODO
* Component documentation
* Better handling of mouse team highlighting (currently, when moving between teams in a particular game, the mouse events fire in inconsistent order and can result in the wrong team left highlighted)
* Consider simplifying the game model passed to this component
* Add tests
