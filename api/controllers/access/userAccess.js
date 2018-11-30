let _this = this;

exports.attributes  = {
	username: {
		read: ['own','other','entity','admin'],
		write: ['own','entity','admin']
	},
	password: {
		read: [],
		write: ['own','entity','admin']
	},
	email: {
		read: ['own','entity','admin'],
		write: ['own','entity','admin']
	}
};

exports.access = {
	'normal': {
		'normal': function(user, target) { return true; }
	},
	'entity':{
		'normal': function(user, target) {
			return user.entity == target.entity;
		},
		'entity': function(user, target) {
			return user.entity == target.entity;
		}
	},
	'admin':{
		'normal': function(user, target) {return true; },
		'entity': function(user, target) {return true; },
	}
}

exports.hasAccess = function(user, target) {
	let access = _this.access;
	if (access[user.userType] && access[user.userType][target.userType]) {
		return access[user.userType][target.userType](user,target);
	}
	else {
		return false;
	}
}