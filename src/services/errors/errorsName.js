const errorDictionary = {
    MISSING_FIELDS: { code: 400, message: "Faltan campos obligatorios." },
    INVALID_ID: { code: 400, message: "ID inválido." },
    NOT_FOUND: { code: 404, message: "Recurso no encontrado." }
};


export default errorDictionary