import PetDTO from "../dto/Pet.dto.js";
import { petsService } from "../services/index.js"
import __dirname from "../utils/index.js";
import CustomError from "../services/errors/customErrors.js";
import errorDictionary from "../services/errors/errorsName.js";
import { generateMockPets } from "../utils/mocking.js";
import errorMessages from "../services/errors/messages/errorMessages.js";

const eM = new errorMessages()

const getAllPets = async (req, res) => {
    try {
        const pets = await petsService.getAll();
        res.status(200).send({ status: "success", payload: pets })
    } catch (error) {
        res.status(500).send('Server error:' + error.message)
    }
}

const createPet = async (req, res) => {
    try {

        const { name, specie, birthDate } = req.body;
        const validPets = []

        console.log('req.body: ' + JSON.stringify(req.body))

        if (Object.keys(req.body).length > 0) {
            if (!name || !specie || !birthDate) {
                CustomError.createError({
                    name: "Pet creation error",
                    cause: eM.createPetErrorInfo(req.body),
                    message: "Error creating Pet - TEST",
                    code: errorDictionary.MISSING_FIELDS
                })
            }
        } else {
            console.log('generando epts')
            const generatePets = generateMockPets()
            console.log('generatedpets: ' + JSON.stringify(generatePets))

            for (let pet of generatePets) {
                if (!pet['name'] || !pet['specie'] || !pet['birthDate']) {
                    CustomError.createError({
                        name: "Pet creation error",
                        cause: eM.createPetErrorInfo(pet),
                        message: "Error creating Pet - TEST",
                        code: errorDictionary.MISSING_FIELDS
                    })
                }
                validPets.push(pet)
            }
        }

        console.log('validpets: ' + JSON.stringify(validPets))

        const pet = PetDTO.getPetInputFrom({ name, specie, birthDate });
        const result = (validPets.length > 0) ? await petsService.create(validPets) : await petsService.create(pet);
        res.status(201).send({ status: "success", payload: result })
    } catch (error) {
        res.status(500).send('Error registering user:' + error.message + error.cause)
    }
}

const updatePet = async (req, res) => {
    try {
        const petUpdateBody = req.body;
        const petId = req.params.pid;
        const result = await petsService.update(petId, petUpdateBody);
        res.status(200).send({ status: "success", message: "pet updated", updatedPet: result })
    } catch (error) {
        res.status(500).send('Error logging user in:' + error.message)
    }
}

const deletePet = async (req, res) => {
    try {
        const petId = req.params.pid;
        const result = await petsService.delete(petId);
        res.status(200).send({ status: "success", message: "pet deleted", deletedPet: result });
    } catch (error) {
        res.status(500).send('Error logging user in:' + error.message)
    }
}

const createPetWithImage = async (req, res) => {
    try {
        const file = req.file;
        const { name, specie, birthDate } = req.body;
        if (!name || !specie || !birthDate) return res.status(400).send({ status: "error", error: "Incomplete values" })
        console.log(file);
        const pet = PetDTO.getPetInputFrom({
            name,
            specie,
            birthDate,
            image: `${__dirname}/../public/img/${file.filename}`
        });
        console.log(pet);
        const result = await petsService.create(pet);
        res.status(201).send({ status: "success", payload: result })
    } catch (error) {
        res.status(500).send('Error logging user in:' + error.message)
    }
}
export default {
    getAllPets,
    createPet,
    updatePet,
    deletePet,
    createPetWithImage
}