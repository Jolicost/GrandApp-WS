var Joi = require('joi');

module.exports = {
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
  forgotPassword: {
    body: {
      phone: Joi.string().required(),
    }
  },
};