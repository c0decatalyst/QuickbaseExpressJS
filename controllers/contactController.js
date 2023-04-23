const contact = require('../models/contact');
const request = require('request');

const contactController = {
    submitContact: (req, res) => {
        contact.submit(req, res, (err, result) => {
            if(err) {
                res.send(err);
            }
            console.log('Controller: Returning result to caller');
            res.json(result); // prob dont need to do this
        });
    }
}

module.exports = contactController;