import { adoptionsService, petsService, usersService } from "../services/index.js"

const getAllAdoptions = async (req, res) => {
    try {
        const result = await adoptionsService.getAll();
        res.status(200).send({ status: "success", payload: result })
    } catch (error) {
        res.status(500).send('Error obtaining all adoptions:' + error.message)
    }
}

const getAdoption = async (req, res) => {
    try {
        const adoptionId = req.params.aid;
        const adoption = await adoptionsService.getBy({ _id: adoptionId })
        if (!adoption) return res.status(404).send({ status: "error", error: "Adoption not found" })
        res.status(200).send({ status: "success", payload: adoption })
    } catch (error) {
        res.status(500).send('Error obtaining adoption:' + error.message)
    }
}

const createAdoption = async (req, res) => {
    try {
        const { uid, pid } = req.params;
        const user = await usersService.getUserById(uid);
        if (!user) return res.status(404).send({ status: "error", error: "user Not found" });
        const pet = await petsService.getBy({ _id: pid });
        if (!pet) return res.status(404).send({ status: "error", error: "Pet not found" });
        if (pet.adopted) return res.status(400).send({ status: "error", error: "Pet is already adopted" });
        user.pets.push(pet._id);
        await usersService.update(user._id, { pets: user.pets })
        await petsService.update(pet._id, { adopted: true, owner: user._id })
        await adoptionsService.create({ owner: user._id, pet: pet._id })
        res.status(201).send({ status: "success", message: "Pet adopted" })
    } catch (error) {
        res.status(500).send('Error creating adoption:' + error.message)
    }
}

export default {
    createAdoption,
    getAllAdoptions,
    getAdoption
}