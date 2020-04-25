class ExistException extends Error{
    constructor(message){
        super(message)
    }
}

module.exports = ExistException