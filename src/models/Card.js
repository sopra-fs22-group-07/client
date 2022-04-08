/**
 * Card model
 */
class Card {
    constructor(data = {}) {
        this.id = null;
        this.text = null;
        Object.assign(this, data);
    }
}
export default Card;
