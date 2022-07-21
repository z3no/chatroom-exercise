let expect = require('expect')

const {newMessage} = require('./message');

describe('New Message', () => {
    it("should generate correct message object", () => {
        let from = "Zeno";
        let text = "Some text to test the text";
        let message = newMessage(from, text);

        expect(typeof message.createdAt).toBe('number');
        expect(message).toMatchObject({from, text});
    })
})