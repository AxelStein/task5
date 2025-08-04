import BookNumDefinition from "./BookNumDefinition.js";

class BookLikesDefinition extends BookNumDefinition {

    constructor(faker) {
        super(faker);
    }

    likes(probability) {
        return this.nextNumFromProbability(probability);
    }
}

export default BookLikesDefinition;