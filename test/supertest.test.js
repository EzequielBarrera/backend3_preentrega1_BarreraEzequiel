import { expect } from "chai"
import { describe, it } from "mocha"
import supertest from "supertest"
import path from "path"

import mongoose from "mongoose"
await mongoose.connect('mongodb+srv://barreraezequiel281:JmJ9ZweaZBMvmGpP@mocks.4rlnk.mongodb.net/')

const requester = supertest("http://localhost:8080")


let userMock = {
    firstName: "prueba",
    lastName: "prueba",
    email: "prueba@prueba.com",
    password: "1234"
}

let petMock = {
    name: "test",
    specie: "test",
    birthDate: "2019-09-11T00:02:20.716Z"
}

let adoptionMock = {
    mock: "mock"
}

let imagePath = path.resolve("./src/public/img/1671549990926-coderDog.jpg")

describe("Pruebas sobre el router /api/users/", function () {
    this.timeout(15000)
    afterEach(async () => {
        await mongoose.connection.collection("users").deleteMany({ email: /prueba@prueba.com/ })
    })
    it("El método GET en /api/users me retorna un código de estado 200", async () => {
        let result = await requester.get("/api/users")
        expect(result.statusCode).to.be.eq(200)
    })
    it("El método GET en /api/users me retorna la lista completa de usuarios registrados en la base de datos", async () => {
        const usersInDb = await mongoose.connection.collection("users").find().toArray()
        let result = await requester.get("/api/users")
        const usersInServer = result.body.payload
        expect(result.statusCode).to.be.eq(200)
        expect(usersInServer.length).to.be.eq(usersInDb.length)
    })
    it("El método GET en /api/users/:uid devuelve el usuario correcto si el ID existe", async () => {
        const mock = await mongoose.connection.collection("users").insertOne(userMock)
        const uid = mock.insertedId.toString()
        const result = await requester.get(`/api/users/${uid}`)
        expect(result.statusCode).to.be.eq(200)
        expect(result.body.payload.email).to.be.eq(userMock.email)
    })
    it("El método GET en /api/users/:uid me retorna un código de estado 404 si el usuario no existe en la base de datos", async () => {
        const fakeId = new mongoose.Types.ObjectId()
        const result = await requester.get(`/api/users/${fakeId}`)
        expect(result.statusCode).to.be.eq(404)
    })
    it("Si el método GET en /api/users/:uid no encuentra el usuario, me va a devolver el error 'User not found'", async () => {
        const fakeId = new mongoose.Types.ObjectId()
        const result = await requester.get(`/api/users/${fakeId}`)
        expect(result.body.error).to.include("User not found")
    })
    it("Si hago cambios con el método PUT en /api/users/:uid de forma correcta, me devuelve un código de estado '200'", async () => {
        const mock = await mongoose.connection.collection("users").insertOne(userMock)
        const uid = mock.insertedId.toString()

        const updateData = { firstName: "pruebatesting" }
        const result = await requester.put(`/api/users/${uid}`).send(updateData)

        expect(result.statusCode).to.be.eq(200)
    })
    it("Si hago cambios con el método PUT en /api/users/:uid de forma correcta, me devuelve el nombre actualizado", async () => {
        const mock = await mongoose.connection.collection("users").insertOne(userMock)
        const uid = mock.insertedId.toString()

        const updateData = { firstName: "pruebatesting" }
        const result = await requester.put(`/api/users/${uid}`).send(updateData)

        expect(result.body.updatedUser.firstName).to.eq("pruebatesting")
    })
    it("El método PUT en /api/users/:uid me retorna un código de estado '404' si el usuario no existe", async () => {
        const fakeId = new mongoose.Types.ObjectId()
        const updateData = { firstName: "nuevoNombre" }

        const result = await requester.put(`/api/users/${fakeId}`).send(updateData)

        expect(result.statusCode).to.be.eq(404)
        expect(result.body).to.have.property("error").that.includes("User not found")
    })
    it("El método DELETE en /api/users/:uid elimina un usuario correctamente y devuelve el código '200'", async () => {
        const mock = await mongoose.connection.collection("users").insertOne(userMock)
        const uid = mock.insertedId.toString()

        const result = await requester.delete(`/api/users/${uid}`)

        expect(result.statusCode).to.be.eq(200)
        expect(result.body).to.have.property("message").that.includes("User deleted")

        const deletedUser = await mongoose.connection.collection("users").findOne({ _id: new mongoose.Types.ObjectId(uid) })
        expect(deletedUser).to.be.null
    })
    it("El método DELETE en /api/users/:uid no funciona si el ID del usuario no existe, y me retorna un código de estado '404'", async () => {
        const fakeId = new mongoose.Types.ObjectId()

        const result = await requester.delete(`/api/users/${fakeId}`)

        expect(result.statusCode).to.be.eq(404)
        expect(result.body).to.have.property("error").that.includes("User not found")
    })
    it("El método DELETE en /api/users/:uid devuelve el usuario eliminado como respuesta", async () => {
        const mock = await mongoose.connection.collection("users").insertOne(userMock)
        const uid = mock.insertedId.toString()

        const result = await requester.delete(`/api/users/${uid}`)


        expect(result.statusCode).to.be.eq(200)
        expect(result.body).to.have.property("deletedUser")
        expect(result.body.deletedUser.email).to.eq(userMock.email)
    })
})
describe("Pruebas sobre el router /api/pets/", function () {
    this.timeout(15000)
    afterEach(async () => {
        await mongoose.connection.collection("pets").deleteMany({ specie: /test/ })
    })
    it("El método GET en /api/pets me retorna un código de estado 200", async () => {
        let result = await requester.get("/api/pets")
        expect(result.statusCode).to.be.eq(200)
    })
    it("El método GET en /api/pets me retorna la lista completa de mascotas registradas en la base de datos", async () => {
        const petsInDb = await mongoose.connection.collection("pets").find().toArray()
        let result = await requester.get("/api/pets")
        const petsInServer = result.body.payload
        expect(result.statusCode).to.be.eq(200)
        expect(petsInServer.length).to.be.eq(petsInDb.length)
    })
    it("Si hago cambios con el método PUT en /api/pets/:pid de forma correcta, me devuelve un código de estado '200'", async () => {
        const mock = await mongoose.connection.collection("pets").insertOne(petMock)
        const pid = mock.insertedId.toString()

        const updateData = { specie: "pruebatesting" }
        const result = await requester.put(`/api/pets/${pid}`).send(updateData)

        expect(result.statusCode).to.be.eq(200)
    })
    it("Si hago cambios con el método PUT en /api/pets/:pid de forma correcta, me devuelve la especie actualizada", async () => {
        const mock = await mongoose.connection.collection("pets").insertOne(petMock)
        const pid = mock.insertedId.toString()

        const updateData = { specie: "pruebatesting" }
        const result = await requester.put(`/api/pets/${pid}`).send(updateData)

        expect(result.body.updatedPet.specie).to.eq("pruebatesting")
    })
    it("El método POST en /api/pets crea una nueva mascota y retorna el código de estado '201'", async () => {
        const result = await requester.post("/api/pets").send(petMock)

        expect(result.statusCode).to.be.eq(201)
        expect(result.body.payload.specie).to.be.eq(petMock.specie)
    })
    it("El método POST en /api/pets retorna un código de estado '400' si dejamos vacíos los campos requeridos", async () => {
        const result = await requester.post("/api/pets").send({ ...petMock, specie: "" })
        expect(result.statusCode).to.be.eq(400)
        expect(result.body).to.have.property("error")
    })
    it("El método POST en /api/pets retorna un código de estado '500' si envíamos un valor inválido en algún campo requerido", async () => {
        const result = await requester.post("/api/pets").send({ ...petMock, specie: 2352 })
        expect(result.statusCode).to.be.eq(500)
    })
    it("El método POST en /api/pets/withimage permite registrar una mascota con imagen y retorna código 201", async () => {
        const result = await requester.post("/api/pets/withimage").field("name", "con imagen").field("specie", "imagen").field("birthDate", "2020-01-01").attach("image", imagePath)
        after(async () => {
            await mongoose.connection.collection("pets").deleteMany({ specie: /imagen/ })
        })
        expect(result.statusCode).to.be.eq(201)
        expect(result.body.payload.specie).to.be.eq("imagen")
    })
    it("El método POST en /api/pets/withimage retorna error 400 si no se completan los campos requeridos", async () => {
        const result = await requester.post("/api/pets/withimage").field("specie", "sinimagen").field("birthDate", "2020-01-01")
        expect(result.statusCode).to.be.eq(400)
        expect(result.body).to.have.property("error")
    })
    it("El método DELETE en /api/pets/:uid elimina una mascota correctamente y retorna un código de estado '200'", async () => {
        const mock = await mongoose.connection.collection("pets").insertOne(petMock)
        const pid = mock.insertedId.toString()

        const result = await requester.delete(`/api/pets/${pid}`)

        expect(result.statusCode).to.be.eq(200)
        expect(result.body).to.have.property("message").that.includes("pet deleted")

        const deletedPet = await mongoose.connection.collection("pets").findOne({ _id: new mongoose.Types.ObjectId(pid) })
        expect(deletedPet).to.be.null
    })
    it("El método DELETE en /api/pets/:pid retorna un código de estado '404' si el ID no existe", async () => {
        const fakeId = new mongoose.Types.ObjectId()

        const result = await requester.delete(`/api/pets/${fakeId}`)

        expect(result.statusCode).to.be.eq(404)
        expect(result.body).to.have.property("error").that.includes("Pet not found")
    })
})
describe("Pruebas sobre el router /api/adoptions/", function () {
    this.timeout(15000)
    afterEach(async () => {
        await mongoose.connection.collection("adoptions").deleteMany({ mock: /mock/ })
        await mongoose.connection.collection("pets").deleteMany({ specie: /test/ })
        await mongoose.connection.collection("users").deleteMany({ email: /prueba@prueba.com/ })
    })
    it("El método GET /api/adoptions me retorna un código de estado 200", async () => {
        let result = await requester.get("/api/adoptions")
        expect(result.statusCode).to.be.eq(200)
    })
    it("El método GET /api/adoptions me retorna una respuesta con property payload de tipo array con los datos de las adopciones", async () => {
        let result = await requester.get("/api/adoptions")
        expect(result.body).to.has.property("payload").that.is.an('array').and.is.not.empty
    })
    it("El método GET en /api/adoptions/:aid retorna un código de estado 404 si el ID de adopción no existe", async () => {
        const fakeId = new mongoose.Types.ObjectId()

        const result = await requester.get(`/api/adoptions/${fakeId}`)

        expect(result.statusCode).to.be.eq(404)
    })
    it("El método GET en /api/adoptions/:aid retorna un código de estado 200 si el ID existe", async () => {
        const mock = await mongoose.connection.collection("adoptions").insertOne(adoptionMock)
        const aid = mock.insertedId.toString()
        const result = await requester.get(`/api/adoptions/${aid}`)
        expect(result.statusCode).to.be.eq(200)
    })
    it("El método POST en /api/adoptions/:uid/:pid retorna un código de estado 201 si se creó correctamente", async () => {
        const mock1 = await mongoose.connection.collection("pets").insertOne(petMock)
        const mock2 = await mongoose.connection.collection("users").insertOne(userMock)
        const pid = mock1.insertedId.toString()
        const uid = mock2.insertedId.toString()

        const result = await requester.post(`/api/adoptions/${uid}/${pid}`).send(adoptionMock)

        expect(result.statusCode).to.be.eq(201)
        expect(result.body).to.have.property("status", "success")
        expect(result.body).to.have.property("message", "Pet adopted")
    })
    it("El método POST en /api/adoptions/:uid/:pid retorna un código de estado 404 si el usuario que adoptó no existe", async () => {
        const mockPet = await mongoose.connection.collection("pets").insertOne(petMock)
        const fakeUid = new mongoose.Types.ObjectId().toString()
        const pid = mockPet.insertedId.toString()

        const result = await requester.post(`/api/adoptions/${fakeUid}/${pid}`).send(adoptionMock)

        expect(result.statusCode).to.be.eq(404)
        expect(result.body).to.have.property("status", "error")
        expect(result.body).to.have.property("error", "user Not found")
    })
    it("El método POST en /api/adoptions/:uid/:pid retorna un código 400 si la mascota ya fue adoptada por otro usuario", async () => {
        const adoptedPetMock = { ...petMock, adopted: true }
        const mockPet = await mongoose.connection.collection("pets").insertOne(adoptedPetMock)
        const mockUser = await mongoose.connection.collection("users").insertOne(userMock)

        const pid = mockPet.insertedId.toString()
        const uid = mockUser.insertedId.toString()

        const result = await requester.post(`/api/adoptions/${uid}/${pid}`).send(adoptionMock)

        expect(result.statusCode).to.be.eq(400)
        expect(result.body).to.have.property("status", "error")
        expect(result.body).to.have.property("error", "Pet is already adopted")
    })
})
describe("Pruebas sobre el router /api/sessions/", function () {
    this.timeout(15000)
    let cookie;

    afterEach(async () => {
        await mongoose.connection.collection("users").deleteMany({ email: /prueba@prueba.com/ })
    })
    it("El médoto POST en /api/sessions/register registra los datos de un usuarios y retorna un código de estado '201'", async () => {
        const result = await requester.post("/api/sessions/register").send(userMock)
        expect(result.statusCode).to.be.eq(201)
        expect(result.body).to.have.property("status", "success")
        expect(result.body.payload).to.be.a('string')
    })
    it("El método POST en /api/sessions/register un código de estado 500 si falla el registro", async () => {
        const result = await requester.post("/api/sessions/register").send({ "email": "prueba@prueba.com", "password": "1234" })
        expect(result.statusCode).to.be.eq(500)
        expect(result.text).to.include("Error registering user")
    })
    it("El método POST en /api/sessions/login iniciará sesión con las credenciales válidas", async () => {
        await requester.post("/api/sessions/register").send(userMock)
        const result = await requester.post("/api/sessions/login").send({ email: userMock.email, password: userMock.password })
        expect(result.statusCode).to.be.eq(200)
        expect(result.body).to.have.property("status", "success")
    })
    it("Al iniciar sesión con las credenciales válidas con el método POST en /api/sessions/login, podemos verificar la existencia de la cookie", async () => {
        await requester.post("/api/sessions/register").send(userMock)
        const result = await requester.post("/api/sessions/login").send({ email: userMock.email, password: userMock.password })
        const cookies = result.headers['set-cookie'];
        expect(cookies).to.exist
        expect(result.headers['set-cookie'][0]).to.include('coderCookie')
    })
    it("El método POST en /api/sessions/login retorna un código de estado 404 si el usuario no existe", async () => {
        const result = await requester.post("/api/sessions/login").send({ email: "prueba@prueba.com", password: "4321" })
        expect(result.statusCode).to.be.eq(404)
        expect(result.body.error).to.be.eq("User doesn't exist")
        expect(result.body).to.not.have.property("payload")
    })
    it("El método POST en /api/sessions/login retorna un código de estado 400 si las credenciales son erróneas", async () => {
        const result = await requester.post("/api/sessions/login")
        expect(result.statusCode).to.be.eq(400)
        expect(result.body).to.have.property("status", "error");
        expect(result.body.error).to.be.eq("Incomplete values")
        expect(result.headers['set-cookie']).to.be.undefined
    })
    it("El método GET en /api/sessions/current retorna la información del usuario actual con cookie válida", async () => {
        await requester.post("/api/sessions/register").send(userMock)
        const loginResponse = await requester.post("/api/sessions/login").send({
            email: userMock.email,
            password: userMock.password
        })

        const cookie = loginResponse.headers['set-cookie'][0].split(';')[0]
        const result = await requester.get("/api/sessions/current").set("Cookie", cookie)
        expect(result.statusCode).to.be.eq(200)
        expect(result.body).to.have.property("payload")
    })
    it("El método GET en /api/sessions/current retorna un código de estado '500' si no existe la cookie", async () => {
        const result = await requester.get('/api/sessions/current');
        expect(result.status).to.be.eq(500);
        expect(result.text).to.include("Server error:jwt must be provided")
    })
    it("El método POST en /api/sessions/unprotectedLogin iniciaría una sesión insegura con una cookie válida", async () => {
        await requester.post("/api/sessions/register").send(userMock)
        const result = await requester.post("/api/sessions/unprotectedLogin").send({ email: userMock.email, password: userMock.password })
        expect(result.statusCode).to.be.eq(200)
        expect(result.headers['set-cookie'][0]).to.include('unprotectedCookie')
    })
    it("Al iniciar la sesión insegura con el método POST en /api/sessions/unprotectedLogin podemos verificar que la cookie insegura existe", async () => {
        await requester.post("/api/sessions/register").send(userMock)
        const result = await requester.post("/api/sessions/unprotectedLogin").send({ email: userMock.email, password: userMock.password })

        const cookies = result.headers['set-cookie'];
        expect(cookies).to.be.an('array').that.is.not.empty;
        const unprotectedCookie = cookies.find(cookie => cookie.startsWith('unprotectedCookie='));
        expect(unprotectedCookie).to.exist
    })
    it("El método GET en /api/sessions/unprotectedCurrent retorna la información de la sesión insegura del usuario actual con cookie válida", async () => {
        await requester.post("/api/sessions/register").send(userMock);

        const loginResponse = await requester.post("/api/sessions/unprotectedLogin").send({
            email: userMock.email,
            password: userMock.password
        });

        const cookie = loginResponse.headers['set-cookie'][0].split(';')[0];

        const result = await requester.get("/api/sessions/unprotectedCurrent").set("Cookie", cookie);

        expect(result.body.payload).to.have.property("email", userMock.email)
        expect(result.statusCode).to.be.eq(200);
        expect(result.body).to.have.property("payload");
    });
    it("El método GET en /api/sessions/unprotectedCurrent retorna un código de estado '500' si no existe la cookie", async () => {
        const result = await requester.get('/api/sessions/unprotectedCurrent');

        expect(result.status).to.be.eq(500);
        expect(result.body).to.not.have.property("payload");
        expect(result.text).to.include("Server error:jwt must be provided");
    });
})
