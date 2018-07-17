import * as React from 'react';
import { v4 } from 'uuid';

export interface ClippedProps {
  path: JSX.Element | JSX.Element[]
}

export default class Clipped extends React.PureComponent<ClippedProps> {
  private _id: any;

  constructor(props: ClippedProps) {
      super(props);
      this._id = v4();
  }

  render() {
    const { path, children } = this.props;

    return (
      <g>
        <defs>
          <clipPath id={this._id}>
            {path}
          </clipPath>
        </defs>

        <g clipPath={`url(#${this._id})`}>
          {children}
        </g>
      </g>
    );
  }
}