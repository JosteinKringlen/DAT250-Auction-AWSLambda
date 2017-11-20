'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk');

AWS.config.update({ region: "eu-west-2" });
AWS.config.setPromisesDependency(require('bluebird'));

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.get = (event, context, callback) => {
    let params = {
        TableName: process.env.SELLER_TABLE,
        ProjectionExpression: "seller_id, seller_name, seller_email, seller_phone"
    };

    console.log('Getting the stuff');
    const onScan = (err, data) => {
        if (err) {
            console.log('Bad stuff: ', JSON.stringify(err, null, 2));
            callback(err);
        } else {
            console.log('Good stuff');
            return callback(null, {
                statusCode: 200,
                body: JSON.stringify({
                    sellers: data.Items
                })
            })
        }
    };

    dynamoDb.scan(params, onScan);
};
