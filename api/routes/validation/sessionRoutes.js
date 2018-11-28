var Joi = require('joi');

module.exports = {
  // POST /api/tasks
  changePassword: {
    body: {
      oldPassword: Joi.string().required(),
      newPassword: Joi.string().required(),
    }
  },
  serviceLogin: {
  	body: {
  		token: Joi.string().required(),
  	}
  },
  register: {
  	body: {
  		password: Joi.string().required(),
  		email: Joi.string().required(),
  		phone: Joi.string().required()
  	}
  },
};