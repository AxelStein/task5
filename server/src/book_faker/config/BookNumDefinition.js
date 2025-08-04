class BookNumDefinition {
    constructor(faker) {
        this.faker = faker;
    }

    nextNumFromProbability(probability) {
        return Math.floor(probability) + (this.faker.number.float() < probability % 1 ? 1 : 0);
    }
}

export default BookNumDefinition;