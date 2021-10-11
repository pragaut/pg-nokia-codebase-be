const responseHelper = require('../../util/response.helper');
const fetch = require('../../util/fetch');
const codes = require('../../util/codes').codes;
const constants = require('../../util/constants');
const path = require('path');


const entry = async (req, res, next) => {
    try {
        // let's get the auth url
        let originalUrl = req.originalUrl;
        const url = process.env.AUTH_URL + (originalUrl.slice(9, originalUrl.length));
	//const url = process.env.AUTH_URL + originalUrl;

         console.log("req originalUrl",req.originalUrl);
        console.log("req.headers",req.headers);

        let response = {};

        
        switch (req.method) {
            case 'GET':
                response = await fetch.get(url, {
                    method: 'get',
                    headers: {
                        ...req.headers,
                        'request-source': req.tbsHostName
                    }
                });
                break;
            case 'POST':
                response = await fetch.get(url, {
                    method: 'post',
                    headers: {
                        ...req.headers,
                        'request-source': req.tbsHostName
                    },
                    body: JSON.stringify(req.body)
                });
                break;
            case 'PUT':
                response = await fetch.get(url, {
                    method: 'put',
                    headers: {
                        ...req.headers,
                        'request-source': req.tbsHostName
                    },
                    body: JSON.stringify(req.body)
                });
                break;
            case 'DELETE':
                response = await fetch.get(url, {
                    method: 'delete',
                    headers: {
                        ...req.headers,
                        'request-source': req.tbsHostName
                    },
                });
                break;
        }

        if (response.code === 200) {
	    console.log("we got the successful result, the access is good");
            // we got the successful result, the access is good
            if (response.data.user) {
                req.user = response.data.user;
            }
            next();
        }
        else {
            // error
            throw response.error;
        }
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR);
    }
};

module.exports.entry = entry;
