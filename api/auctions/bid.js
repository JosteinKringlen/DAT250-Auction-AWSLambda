'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk');

AWS.config.update({ region: "eu-west-2" });
AWS.config.setPromisesDependency(require('bluebird'));

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.bid = (event, context, callback) => {
    const bodyData = JSON.parse(event.body);

    const timestamp = new Date().getTime();

    if(typeof bodyData.new_bid !== 'number'){
        callback(null, {
            statusCode: 400,
            body: 'Bad request. Invalid value for one of the inputs',
        });
    }

    const params = {
        TableName: process.env.AUCTION_TABLE,
        Item: {
            auction_id: event.pathParameters.auction_id,
            bids: bodyData.new_bid,
            updated_at: timestamp,
        }
    };

    dynamoDb.update(params).promise().then(res => {
        const result = {
            statusCode: 200,
            body: JSON.stringify(res.Item),
        };
        callback(null, result);
    }).catch(err => {
        console.error(err);
        callback(new Error('Bad stuff'));
    })
   /* dynamoDb.update(params).promise().then(res => {
        const result = {
            statusCode: 200,
            body: JSON.stringify(res.Item),
        };
        callback(null, result);
    }).catch(err => {
        console.error(err);
        callback(new Error('Could not fetch auction.'));
    });*/
};
