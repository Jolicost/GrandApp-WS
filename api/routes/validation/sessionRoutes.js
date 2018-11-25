var Joi = require('joi');

module.exports = {
  // POST /api/tasks
  changePassword: {
    body: {
      oldPassword: Joi.string().required(),
      newPassword: Joi.string().required(),
    }
  },
};