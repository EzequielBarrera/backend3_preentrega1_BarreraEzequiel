import winston from "winston";

const logger = winston.createLogger({
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                // winston.format.colorize(),  <-- si lo descomento no funciona el endpoint /loggerTest con mi versión de node (20.11.1)
                winston.format.simple(),
            ),
        }),
        new winston.transports.File({ filename: "errors.log", level: "error" })
    ]
});

export default logger;