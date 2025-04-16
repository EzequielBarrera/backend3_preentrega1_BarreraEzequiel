import errorDictionary from "./errorsName.js";
import logger from "../../utils/logger.js";

export const errorHandler = (err, req, res, next) => {
    logger.error(err);
    const errorResponse = errorDictionary[err.message] || { code: 500, message: "Error interno del servidor." };
    res.status(errorResponse.code).json({ error: errorResponse.message })
}