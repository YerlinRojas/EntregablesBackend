import EErrors from "../services/errors/enums.js"


export const typeError = (error, req, res, next) => {
    console.error(error.cause)

    switch (error.code) {
        case EErrors.INVALID_TYPES_ERROR:
            return res.status(400).send({
                status: 'error',
                error: error.name,
                cause: error.cause
            })
        default:
            return res.send({status: 'error', error: 'Unhandled error'})
    }
}

export const routingError = (error, req, res, next) => {
    console.error(error.cause)

    switch (error.code) {
        case EErrors.ROUTING_ERROR:
            return res.status(404).send({
                status: 'error',
                error: error.name,
                cause: error.cause
            })
        default:
            return res.send({status: 'error', error: 'Unhandled error'})
    }
}

export const dataBasesError = (error, req, res, next) => {
    console.error(error.cause)

    switch (error.code) {
        case EErrors.DATABASES_ERROR:
            return res.status(500).send({
                status: 'error',
                error: error.name,
                cause: error.cause
            })
        default:
            return res.send({status: 'error', error: 'Unhandled error'})
    }
}

export const cartNotFoundError = (error, req, res, next) => {
    console.error(error.cause)

    switch (error.code) {
        case EErrors.CART_NOT_FOUND_ERROR:
            return res.status(500).send({
                status: 'error',
                error: error.name,
                cause: error.cause
            })
        default:
            return res.send({status: 'error', error: 'Unhandled error'})
    }
}