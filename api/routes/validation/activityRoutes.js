var Joi = require('joi');

module.exports = {
  // POST /api/tasks
  // Title id desc lat long images timestart start i end capacity price
  update: {
    body: {
      lat: Joi.number().required(),
      long: Joi.number().required(),
      title: Joi.string().required(),
      description: Joi.string().required(),
      images: Joi.array().items(Joi.string()).required(),
      activityType: Joi.string().required(),
      timestampStart: Joi.date().required(),
      timestampEnd: Joi.date().required(),
      capacity: Joi.number().required(),
      price: Joi.number().required()
    }
  },
  geo: {
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
      maxPrice: Joi.number().min(0),
      sort: Joi.number().min(0).max(7)
    }
  }
};