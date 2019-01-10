var Joi = require('joi');

module.exports = {
  updateNormal: {
    body: {
      completeName: Joi.string().required(),
      email: Joi.string().required(),
      phone: Joi.string().required(),
      profilePic: Joi.string().required(),
      notifications: Joi.object().keys({
        nearActivity: Joi.boolean().required(),
        joinedActivity: Joi.boolean().required(),
        finishedActivity: Joi.boolean().required()
      }).required()
    }
  },
  updateEntity: {
  	body: {
  		completeName: Joi.string().required(),
  		email: Joi.string().required(),
  		phone: Joi.string().required(),
  		password: Joi.string(),
  		profilePic: Joi.string().required(),
  		birthday: Joi.string().required()
  	}
  }
};