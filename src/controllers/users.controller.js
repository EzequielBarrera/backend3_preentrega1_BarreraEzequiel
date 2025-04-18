import { usersService } from "../services/index.js"

const getAllUsers = async (req, res) => {
    try {
        const users = await usersService.getAll();
        res.status(200).send({ status: "success", payload: users })
    } catch (error) {
        res.status(500).send('Server error:' + error.message)
    }
}

const getUser = async (req, res) => {
    try {
        const userId = req.params.uid;
        const user = await usersService.getUserById(userId);
        if (!user) return res.status(404).send({ status: "error", error: "User not found" })
        res.status(200).send({ status: "success", payload: user })
    } catch (error) {
        res.status(500).send('Server error:' + error.message)
    }
}

const updateUser = async (req, res) => {
    try {
        const updateBody = req.body;
        const userId = req.params.uid;
        const user = await usersService.getUserById(userId);
        if (!user) return res.status(404).send({ status: "error", error: "User not found" })
        const result = await usersService.update(userId, updateBody);
        res.status(200).send({ status: "success", message: "User updated", updatedUser: result })
    } catch (error) {
        res.status(500).send('Server error:' + error.message)
    }
}

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.uid;
        const result = await usersService.getUserById(userId);
        res.status(200).send({ status: "success", message: "User deleted", deletedUser: result })
    } catch (error) {
        res.status(500).send('Server error:' + error.message)
    }
}

export default {
    deleteUser,
    getAllUsers,
    getUser,
    updateUser
}