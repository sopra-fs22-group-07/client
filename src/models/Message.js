/**
 * User model
 */
class Message {
    constructor(data = {}) {
        this.id = null;
        this.messageType = null;
        this.content = null;
        this.fromUserId = null;
        this.toUserId = null;
        this.creationDate = null;
        this.read = null;
        Object.assign(this, data);
    }
}
export default Message;
