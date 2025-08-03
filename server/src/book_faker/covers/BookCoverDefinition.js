import covers from './covers.js';

class BookCoverDefinition {
    constructor(faker) {
        this.faker = faker;
    }

    cover() {
        return this.faker.helpers.arrayElement(covers);
    }
}

export default BookCoverDefinition;