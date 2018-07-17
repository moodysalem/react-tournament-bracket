import {Side, SideInfo} from './models';

interface Game {
    id: string;
    // the game name
    name: string;
    // optional: the label for the game within the bracket, e.g. Gold Finals, Silver Semi-Finals
    bracketLabel?: string;
    // the unix timestamp of the game-will be transformed to a human-readable time using momentjs
    scheduled: number;

    court?: {
        name: string;
        venue: {
            name: string
        }
    };

    sides: {
        [side in Side]: SideInfo
    };
}

export default Game;