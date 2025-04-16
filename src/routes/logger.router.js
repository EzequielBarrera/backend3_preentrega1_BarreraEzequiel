import { Router } from "express";
import logger from "../utils/logger.js";

const router = Router()

router.get('/', (req, res) => {
    logger.debug("Este es un mensaje de debug");
    logger.http("Este es un mensaje http");
    logger.info("Este es un mensaje info");
    logger.warning("Este es un mensaje warning");
    logger.error("Este es un mensaje error");
    logger.fatal("Este es un mensaje fatal");
    res.send("Logs generados en consola y archivo errors.log");
});

export default router