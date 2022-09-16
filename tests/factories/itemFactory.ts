import {faker} from '@faker-js/faker'

export default async function itemFactory() {
    const body = {
        title: faker.lorem.words(3),
        url:faker.internet.url(),
        description:faker.lorem.paragraphs(1),
        amount:faker.datatype.number()
    }
    return body
}