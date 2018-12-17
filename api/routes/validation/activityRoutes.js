var Joi = require('joi');

module.exports = {
  // POST /api/tasks
  update: {
    body: {
      lat: Joi.number().required(),
      long: Joi.number().required()
    }
  }
};