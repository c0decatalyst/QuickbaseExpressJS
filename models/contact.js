const request = require('request');
const xml2js = require('xml2js');
var validator = require('validator');

const userToken = 'InsertYourUserTokenHereFromQuickBase';
const qbUrl = 'https://InsertYourQuickBaseWebUrl.quickbase.com/db/yourDBKey?a=API_AddRecord';

var procUrl = (fName, lastName, pnumber, avail, email, productId) => {
    var delimiter = '&_fnm_';
    var paddedUrl = qbUrl + delimiter + 'first_name=' + fName 
                            + delimiter + 'last_name=' + lastName
                            + delimiter + 'phone_number=' + pnumber
                            + delimiter + 'time=' + avail
                            + delimiter + 'email=' + email
                            + delimiter + 'product=' + productId;
    return paddedUrl;
}

var validateReq = (req) => {
    console.log(req.body);
    console.log("START validator");
    if(validator.isEmail(req.body.email) == true &&
        validator.isEmpty(req.body.lastName) == false &&
        validator.isEmpty(req.body.firstName) == false) {
            console.log('END validator - success');
            return true;
    }
    console.log('END validator - FAILED');
    return false;
}

const contact = {
    submit: (req, res, next) => {
        // validate the requested fields
        console.log('validating request');
        if(validateReq(req)) {
            // build the url fields
            parsedUrl = procUrl(req.body.firstName, req.body.lastName, req.body.phone, req.body.availTime, req.body.email, req.body.productId);
            var reqOptions = {
                url: parsedUrl + '&usertoken=' + userToken,
                method: 'POST',
            }
            // console.log(reqOptions.url);
            // fire off service request/process response from server
            request(reqOptions, (error, response, body) => {
                if(!error && response.statusCode == 200) {                
                    console.log('successfully received response from external service')
                    xml2js.parseString(body, (err, result) => {
                        console.log(result);
                        res.status(200).send();
                    });
                } else {
                    console.log('response returned failure from external service')
                    console.log(response.statusCode + response.body);
                    res.status(500).send() // send an internal server error
                }
            });
        } else {
            console.log('request failed validation');
            res.status(400).send("Failed Validation")
        }
    }
};

module.exports = contact;