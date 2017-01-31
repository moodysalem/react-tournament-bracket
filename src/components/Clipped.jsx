import React, { PropTypes, PureComponent } from 'react';
import { v4 } from 'uuid';

export default class Clipped extends PureComponent {
  static propTypes = {
    path: PropTypes.oneOfType([ PropTypes.node, PropTypes.arrayOf(PropTypes.node) ]).isRequired
  };

  static defaultProps = {};

  _id = v4();

  render() {
    const { _id } = this,
      { path, children } = this.props;

    return (
      <g>
        <defs>
          <clipPath id={_id}>
            {path}
          </clipPath>
        </defs>

        <g clipPath={`url(#${_id})`}>
          {children}
        </g>
      </g>
    );
  }
};

export class RectClipped extends PureComponent {
  static propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  };

  static defaultProps = {};

  render() {
    const { x, y, width, height, children } = this.props;

    return (
      <Clipped path={<rect x={x} y={y} width={width} height={height}/>}>
        {children}
      </Clipped>
    );
  }
}
