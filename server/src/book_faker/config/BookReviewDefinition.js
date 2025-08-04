import BookNumDefinition from "./BookNumDefinition.js";

class BookReviewDefinition extends BookNumDefinition {

    constructor(faker, authorFaker, items) {
        super(faker);
        this.items = items;
        this.reviewsFaker = authorFaker;
    }

    reviews(probability) {
        return this.faker.helpers.arrayElements(this.items, this.nextNumFromProbability(probability))
            .map(comment => {
                return {
                    comment,
                    author: this.reviewsFaker.person.fullName(),
                    date: this.reviewsFaker.date.past()
                };
            });
    }
}

export default BookReviewDefinition;