const createPetErrorInfo = (pet) => {
    return `Una o más propiedades fueron enviadas incompletas o no son válidas.
        Propiedades requeridas:
    - name: type String, recibido: ${pet.name}
    - specie: type String, recibido: ${pet.specie}
    - birthDate: type Date, recibido: ${pet.birthDate}
    - adopted: type Boolean, recibido: ${pet.adopted}`

}

export const createUserErrorInfo = (user) => {
    return `Una o más propiedades fueron enviadas incompletas o no son válidas.
        Propiedades requeridas:
    - firstName: type String, recibido: ${user.firstName}
    - lastName: type String, recibido: ${user.lastName}
    - email: type String, recibido: ${user.email}
    - password: type String
    `
}

export default createPetErrorInfo