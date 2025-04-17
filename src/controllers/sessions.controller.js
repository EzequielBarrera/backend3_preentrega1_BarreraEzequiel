import { usersService } from "../services/index.js";
import { createHash, passwordValidation } from "../utils/index.js";
import jwt from 'jsonwebtoken';
import UserDTO from '../dto/User.dto.js';
import CustomError from "../services/errors/customErrors.js";
import errorDictionary from "../services/errors/errorsName.js";
import createUserErrorInfo from "../services/errors/messages/errorMessages.js"
const register = async (req, res) => {
    try {
        console.log("intentando registrar usuario")
        const { firstName, lastName, email, password } = req.body;
        console.log(req.body)
        if (!firstName || !lastName || !email || !password) {
            console.log("validando campos")
            CustomError.createError({
                name: "User creation error",
                cause: createUserErrorInfo(req.body),
                message: "Error creating User - TEST",
                code: errorDictionary.MISSING_FIELDS
            })
        };

        const exists = await usersService.getUserByEmail(email);
        if (exists) return res.status(400).send({ status: "error", error: "User already exists" });
        const hashedPassword = await createHash(password);
        const user = {
            firstName,
            lastName,
            email,
            password: hashedPassword
        }
        console.log(user)
        let result = await usersService.create(user);
        console.log(result);
        res.send({ status: "success", payload: result._id });
    } catch (error) {
        console.log('Error registering user:' + error.message + error.cause)
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).send({ status: "error", error: "Incomplete values" });
    const user = await usersService.getUserByEmail(email);
    if (!user) return res.status(404).send({ status: "error", error: "User doesn't exist" });
    const isValidPassword = await passwordValidation(user, password);
    if (!isValidPassword) return res.status(400).send({ status: "error", error: "Incorrect password" });
    const userDto = UserDTO.getUserTokenFrom(user);
    const token = jwt.sign(userDto, 'tokenSecretJWT', { expiresIn: "1h" });
    res.cookie('coderCookie', token, { maxAge: 3600000 }).send({ status: "success", message: "Logged in" })
}

const current = async (req, res) => {
    const cookie = req.cookies['coderCookie']
    const user = jwt.verify(cookie, 'tokenSecretJWT');
    if (user)
        return res.send({ status: "success", payload: user })
}

const unprotectedLogin = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).send({ status: "error", error: "Incomplete values" });
    const user = await usersService.getUserByEmail(email);
    if (!user) return res.status(404).send({ status: "error", error: "User doesn't exist" });
    const isValidPassword = await passwordValidation(user, password);
    if (!isValidPassword) return res.status(400).send({ status: "error", error: "Incorrect password" });
    const token = jwt.sign(user, 'tokenSecretJWT', { expiresIn: "1h" });
    res.cookie('unprotectedCookie', token, { maxAge: 3600000 }).send({ status: "success", message: "Unprotected Logged in" })
}
const unprotectedCurrent = async (req, res) => {
    const cookie = req.cookies['unprotectedCookie']
    const user = jwt.verify(cookie, 'tokenSecretJWT');
    if (user)
        return res.send({ status: "success", payload: user })
}
export default {
    current,
    login,
    register,
    current,
    unprotectedLogin,
    unprotectedCurrent
}