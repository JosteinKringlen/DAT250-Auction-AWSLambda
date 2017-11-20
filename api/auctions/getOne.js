'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk');

AWS.config.update({ region: "eu-west-2" });
AWS.config.setPromisesDependency(require('bluebird'));

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.get = (event, context, callback) => {
    const params = {
        TableName: process.env.AUCTION_TABLE,
        Key: {
            auction_id: event.pathParameters.auction_id
        },
    };

    dynamoDb.get(params).promise().then(res => {
        const result = {
            statusCode: 200,
            body: JSON.stringify(res.Item),
        };
        callback(null, result);
    }).catch(err => {
       console.error(err);
       callback(new Error('Could not fetch auction.'));
    });
};