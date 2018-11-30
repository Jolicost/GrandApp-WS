const AccessControl = require('accesscontrol');
const ac = new AccessControl();

	
ac.grant('normal')
	.createOwn('activity')
	.deleteOwn('activity')
	.readAny('activity')
.grant('entity')
	.deleteAny('activity');

ac
	.grant('normal')
		.readOwn('user',['*','!password'])
		.readAny('user',["_id","username","profilePic","completeName"])

ac 
	.grant('entity')
		.extend('normal')
		.readOwn('user',['*','!password']);




module.exports = ac;

