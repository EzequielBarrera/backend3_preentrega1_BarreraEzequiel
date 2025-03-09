import { faker } from "@faker-js/faker";

const generateMockUsers = (count = 50) => {
    return Array.from({ length: count }, () => ({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: "coder123",
        role: faker.helpers.arrayElement(["user", "admin"]),
        pets: []
    }))
}

export default generateMockUsers