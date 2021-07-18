const BaseJoi = require('joi');
const sanitizeHTML = require("sanitize-html");


const extension = (joi) => ({
    type: "string",
    base: joi.string(),
    messages: {
        "string.escapeHTML": "{{#label}} must not include HTML!"
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHTML(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error("string.escapeHTML", {value})
                return clean;
            }
        }
    }
});


const Joi = BaseJoi.extend(extension);


module.exports.campgroundSchema = Joi.object({
    campgroundContent: Joi.object({
        title: Joi.string().required().escapeHTML(),
        location: Joi.string().required().escapeHTML(),
        price: Joi.number().required().min(0),
        description: Joi.string().required().escapeHTML(),
        // images: Joi.string().required()
    }).required(),
    deleteImages: Joi.array()
});


module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        comment: Joi.string().required().escapeHTML(),
        rating: Joi.number().min(0).max(5).required()
    }).required()
});


