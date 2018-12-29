const nodeMailer = require('nodemailer');
var config = require('../../../config/config.js');

function getTransporter() {
	let transporter = nodeMailer.createTransport(config.get('mail'));
	return transporter;
}

function sendMail(email,options, callback) {
	getTransporter().sendMail(options, (error, info) => {
        if (error) {
            callback(error);
        } else {
            callback(null)
        }
    });
}


exports.sendForgotPassword = function(email, password, callback) {
	let mailOptions = {
        from: 'donotreply@grandapp.com', // sender address
        to: email, // list of receivers
        subject: 'Change password', // Subject line
        text: 'Your new password is: ' + password, // plain text body
    };

    sendMail(email,mailOptions,callback);
}