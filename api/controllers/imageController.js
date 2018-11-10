'use strict';

var imgur = require('imgur');
var isBase64 = require('is-base64');

exports.create = function(req, res) {
    let base64 = req.body;

    if (!isBase64(base64)) return res.status(432).send("Bad image format");

    imgur.uploadBase64(base64)
    .then(function (json) {
        return res.status(200).send(json.data.link);
    })
    .catch(function (err) {
        return res.status(433).send("Failed to upload image");
    });

};

exports.createJson = function(req, res) {
    let base64 = req.body.base64;

    if (!isBase64(base64)) return res.status(432).send("Bad image format");

    imgur.uploadBase64(base64)
    .then(function (json) {
        return res.status(200).send({
            imageUrl: json.data.link
        });
    })
    .catch(function (err) {
        return res.status(433).send("Failed to upload image");
    });

};

exports.test = function(req, res) {
    return res.status(200).send("Test succeeded");
}