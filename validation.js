
const Joi = require('joi');


const registerValidation = data => {

    const registerSchema = Joi.object({
        email: Joi.string().min(6).required(),
        password: Joi.string().min(6).required(),
        name: Joi.string().min(4).required(),
        apikey: Joi.string().min(2).required(),
        status: Joi.string().min(2).required(),
        myapikey: Joi.string().min(2).required(),
        secret: Joi.string().required()
    });


    return registerSchema.validate(data);

};

const loginValidation = data => {

    const loginSchema = Joi.object({
        email: Joi.string().min(6).required(),
        password: Joi.string().min(6).required(),
        apikey: Joi.string().min(2).required()
    });


    return loginSchema.validate(data);

};

const appValidation = data => {

    const loginSchema = Joi.object({
        id : Joi.string().required(),
        myapikey: Joi.string().required(),
        secret: Joi.string().required()
    });

    return loginSchema.validate(data);

};



module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.appValidation = appValidation;

