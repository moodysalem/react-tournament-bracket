import * as React from 'react';
import Clipped from './Clipped';

export interface ReactClippedProps {
    x: number;
    y: number;
    width: number;
    height: number;
}

export default class ReactClipped extends React.Component<ReactClippedProps> {
    constructor(props: ReactClippedProps) {
        super(props);
    }

    render() {
        const { x, y, width, height, children } = this.props;

        return (
            <Clipped path={<rect x={x} y={y} width={width} height={height}/>}>
                {children}
            </Clipped>
        );
    }
}
