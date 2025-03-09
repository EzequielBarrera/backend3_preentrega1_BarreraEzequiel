import { Router } from "express";
import generateMockUsers from "../utils/mocking.js";
import logger from "../utils/logger.js";
import User from '../dao/models/User.js'

const router = Router()

router.get('/mockingusers', (req, res) => {
    const users = generateMockUsers(50)
    res.json({ status: "success", users })
})

router.get('/loggerTest', (req, res) => {
    logger.debug("Este es un mensaje de debug");
    logger.http("Este es un mensaje http");
    logger.info("Este es un mensaje info");
    logger.warning("Este es un mensaje warning");
    logger.error("Este es un mensaje error");
    logger.fatal("Este es un mensaje fatal");
    res.send("Logs generados en consola y archivo errors.log");
});

router.post('/generateData', async (req, res) => {
    const { users } = req.body;
    try {
        const generatedUsers = generateMockUsers(users)
        const insertedUsers = await User.insertMany(generatedUsers)

        logger.info(`${users} usuarios generados e insertados en la base de datos.`)

        res.json({
            status: "success",
            message: insertedUsers.length + ` usuarios generados e insertados`,
            users: insertedUsers.length,
        });
    } catch (error) {
        logger.error("Error al generar o insertar los datos" + error.message)
        res.status(500).json({ error: "Error al generar o insertar los datos" })
    }
})

export default router