import { usersService } from "../services/index.js";
import { createHash, passwordValidation } from "../utils/index.js";
import jwt from 'jsonwebtoken';
import UserDTO from '../dto/User.dto.js';
import CustomError from "../services/errors/customErrors.js";
import errorDictionary from "../services/errors/errorsName.js";
import errorMessages from "../services/errors/messages/errorMessages.js";

const eM = new errorMessages()
const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        if (!firstName || !lastName || !email || !password) {
            CustomError.createError({
                name: "User creation error",
                cause: eM.createUserErrorInfo(req.body),
                message: "Error creating User - TEST",
                code: errorDictionary.MISSING_FIELDS
            })
        };

        const exists = await usersService.getUserByEmail(email);
        if (exists) return res.status(400).send({ status: "error", error: "User already exists" });
        const hashedPassword = createHash(password);
        const user = {
            firstName,
            lastName,
            email,
            password: hashedPassword
        }
        let result = await usersService.create(user);
        res.status(201).send({ status: "success", payload: result._id });
    } catch (error) {
        res.status(500).send('Error registering user:' + error.message + error.cause)
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).send({ status: "error", error: "Incomplete values" });
        const user = await usersService.getUserByEmail(email);
        if (!user) return res.status(404).send({ status: "error", error: "User doesn't exist" });
        // const isValidPassword = passwordValidation(user.password, password);
        // if (!isValidPassword) return res.status(400).send({ status: "error", error: "Incorrect password" });
        const userDto = UserDTO.getUserTokenFrom(user);
        const token = jwt.sign(userDto, 'tokenSecretJWT', { expiresIn: "1h" });
        res.status(200).cookie('coderCookie', token, { maxAge: 3600000 }).send({ status: "success", message: "Logged in" })
    } catch (error) {
        res.status(500).send('Error logging user in:' + error.message)
    }
}

const current = async (req, res) => {
    try {
        const cookie = req.cookies['coderCookie']
        const user = jwt.verify(cookie, 'tokenSecretJWT');
        if (user)
            return res.status(200).send({ status: "success", payload: user })
    } catch (error) {
        res.status(500).send('Server error:' + error.message)
    }
}

const unprotectedLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).send({ status: "error", error: "Incomplete values" });
        const user = await usersService.getUserByEmail(email);
        if (!user) return res.status(404).send({ status: "error", error: "User doesn't exist" });
        // const isValidPassword = passwordValidation(user.password, password);
        // if (!isValidPassword) return res.status(400).send({ status: "error", error: "Incorrect password" });
        const token = jwt.sign(user.toObject(), 'tokenSecretJWT', { expiresIn: "1h" });
        res.status(200).cookie('unprotectedCookie', token, { maxAge: 3600000 }).send({ status: "success", message: "Unprotected Logged in" })
    } catch (error) {
        res.status(500).send('Server error:' + error.message)
    }
}
const unprotectedCurrent = async (req, res) => {
    try {
        const cookie = req.cookies['unprotectedCookie']
        const user = jwt.verify(cookie, 'tokenSecretJWT');
        if (user)
            return res.status(200).send({ status: "success", payload: user })
    } catch (error) {
        res.status(500).send('Server error:' + error.message)
    }
}
export default {
    login,
    register,
    current,
    unprotectedLogin,
    unprotectedCurrent
}