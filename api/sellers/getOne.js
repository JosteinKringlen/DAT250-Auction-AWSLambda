'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk');

AWS.config.update({ region: "eu-west-2" });
AWS.config.setPromisesDependency(require('bluebird'));

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.get = (event, context, callback) => {
    const params = {
        TableName: process.env.SELLER_TABLE,
        Key: {
            seller_id: event.pathParameters.seller_id
        },
    };

    dynamoDb.get(params).promise().then(res => {
        let bodyRes = {};
        if (res.Item !== null){
            bodyRes = res.Item;
        }
        const result = {
            statusCode: 200,
            body: JSON.stringify(bodyRes),
            headers: {
                "Access-Control-Allow-Origin" : "*"
            },
        };
        callback(null, result);
    }).catch(err => {
        console.error(err);
        callback(new Error('Could not fetch auction.'));
    });
};