var Joi = require('joi');

module.exports = {
  // POST /api/tasks
  updateNormal: {
    body: {
      completeName: Joi.string().required(),
      email: Joi.string().required(),
      phone: Joi.string().required(),
      profilePic: Joi.string().required()
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