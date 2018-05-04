import * as React from 'react';
import { v4 } from 'uuid';

export interface ClippedProps {
  path: JSX.Element | Array<JSX.Element>
}

export default class Clipped extends React.PureComponent<ClippedProps> {
  _id = v4();

  render() {
    const { _id } = this;
    const { path, children } = this.props;

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

export interface RectClippedProps {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class RectClipped extends React.PureComponent<RectClippedProps> {
  render() {
    const { x, y, width, height, children } = this.props;

    return (
      <Clipped path={<rect x={x} y={y} width={width} height={height}/>}>
        {children}
      </Clipped>
    );
  }
}
