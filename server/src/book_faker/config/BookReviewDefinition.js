import BookNumDefinition from "./BookNumDefinition.js";

class BookReviewDefinition extends BookNumDefinition {

    constructor(faker, items) {
        super(faker);
        this.items = items;
    }

    reviews(probability) {
        return this.faker.helpers.arrayElements(this.items, this.nextNumFromProbability(probability))
            .map(comment => {
                return {
                    author: this.faker.person.fullName(),
                    comment,
                    date: this.faker.date.past()
                };
            });
    }
}

export default BookReviewDefinition;