import Game from './Game';

interface SideInfo {
    score?: {
        score: number;
    };

    seed?: {
        displayName: string;
        rank: number;
        sourceGame: Game;
        sourcePool: object;
    };

    team?: {
        id: string;
        name: string;
    }
}

export default SideInfo;