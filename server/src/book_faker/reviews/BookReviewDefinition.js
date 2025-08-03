class BookReviewDefinition {

    constructor(faker, items) {
        this.faker = faker.numFaker;
        this.items = items;
    }

    /**
     * @param {Number} count 
     * @returns 
     */
    reviews(count) {
        return this.faker.helpers.arrayElements(this.items, count)
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