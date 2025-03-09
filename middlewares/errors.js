import logger from '../src/utils/logger.js';

export const errorDictionary = {
    MISSING_FIELDS: { code: 400, message: "Faltan campos obligatorios." },
    INVALID_ID: { code: 400, message: "ID inválido." },
    NOT_FOUND: { code: 404, message: "Recurso no encontrado." }
};

export const errorHandler = (err, req, res, next) => {
    logger.error(err);
    const errorResponse = errorDictionary[err.message] || { code: 500, message: "Error interno del servidor." };
    res.status(errorResponse.code).json({ error: errorResponse.message })
}



