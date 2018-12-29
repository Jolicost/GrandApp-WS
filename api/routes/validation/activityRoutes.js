var Joi = require('joi');

module.exports = {
  // POST /api/tasks
  update: {
    body: {
      lat: Joi.number().required(),
      long: Joi.number().required()
    }
  },
  vote: {
  	body: {
  		rating: Joi.number().min(0).max(10).required()
  	}
  },
  list: {
    query: {
      minPrice: Joi.number().min(0),
      maxPrice: Joi.number().min(0)
    }
  }
};