class BookCoverDefinition {
    constructor(faker, covers) {
        this.faker = faker;
        this.covers = covers;
    }

    cover() {
        return this.faker.helpers.arrayElement(this.covers);
    }
}

export default BookCoverDefinition;