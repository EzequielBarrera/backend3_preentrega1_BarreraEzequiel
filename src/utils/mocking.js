import { faker } from "@faker-js/faker";

export const generateMockPets = (count = 100) => {
    console.log('generando pets')
    let actualDate = new Date()
    let birthDate = faker.date.past({ years: 15 })
    return Array.from({ length: count }, () => ({
        name: faker.animal.cat(),
        specie: faker.animal.type(),
        birthDate: birthDate,
        age: Math.floor((actualDate - birthDate) / (1000 * 60 * 60 * 24 * 365)),
        owner: null,
        adopted: false,
        image: '.src/public/img/1671549990926-coderDog.jpg'
    }));
};

export const generateMockUsers = (count = 50) => {
    return Array.from({ length: count }, () => ({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: "coder123",
        role: faker.helpers.arrayElement(["user", "admin"]),
        pets: []
    }))
}