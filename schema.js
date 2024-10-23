const joi=require('joi');
const reviews = require('./models/reviews.js');

module.exports.listingschemas = joi.object({
    listing: joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
        price: joi.number().required().min(10),
        location: joi.string().required(),
        country:joi.string().required(),
        image:joi.string().allow("",null),
}).required()
});



module.exports.reviewschema = joi.object({
    review: joi.object({
        rating: joi.number().required().min(1).max(5),
        comment: joi.string().required(),
})
});