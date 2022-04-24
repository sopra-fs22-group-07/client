/**
 * Game model
 */
class Game {
    constructor(data = {}) {
        this.gameId = null;
        this.plays = null;
        this.userId = null;
        this.blackCard = null;
        this.date = null;
        this.gameStatus = null;
        Object.assign(this, data);
    }
}
export default Game;
