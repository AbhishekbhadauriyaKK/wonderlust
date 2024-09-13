const joi=require('joi');

module.exports.listingschemas = joi.object({
    listing: joi.object({
        title: joi.string().required(),
        Description: joi.string().required(),
        price: joi.number().required().min(10),
        location: joi.string().required(),
        country:joi.string().required(),
        image:joi.string().allow("",null),
}).required()
});