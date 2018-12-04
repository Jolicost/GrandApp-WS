var Joi = require('joi');

module.exports = {
  // POST /api/tasks
  updateNormal: {
    body: {
      completeName: Joi.string().required(),
      address: Joi.string().required(),
      email: Joi.string().required(),
      phone: Joi.string().required(),
      profilePic: Joi.string().required()
    }
  }
};