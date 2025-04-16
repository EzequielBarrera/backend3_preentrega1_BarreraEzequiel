class CustomError {
    static createError({ name = "Error", cause, message, code = 1 }) {
        console.log("creating error")
        const error = new Error(message, { cause: new Error(cause) })
        error.name = name
        error.code = code
        throw error
    }
}

export default CustomError