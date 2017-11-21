'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk');

AWS.config.update({ region: "eu-west-2" });
AWS.config.setPromisesDependency(require('bluebird'));

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.bid = (event, context, callback) => {
    const bodyData = JSON.parse(event.body);
    const newBid = bodyData.new_bid;
    const bidder_id = bodyData.bidder_id;

    const timestamp = new Date().getTime();

    if(typeof newBid !== 'number' || typeof bidder_id !== 'string'){
        callback(null, {
            statusCode: 400,
            body: 'Bad request. Invalid value for one of the inputs',
        });
    }

    const params = {
        TableName: process.env.AUCTION_TABLE,
        Key: {
            auction_id: event.pathParameters.auction_id,
        },
        UpdateExpression: "set #bids = list_append(if_not_exists(#bids, :empty_list), :biddings), updated_at = :ua",
        ExpressionAttributeNames: {
            "#bids": "bids",
        },
        ExpressionAttributeValues: {
            ":biddings": [{newBid, bidder_id}],
            ":empty_list": [],
            ":ua": timestamp
        },
        ReturnValues:"ALL_NEW"
    };

   dynamoDb.update(params).promise().then(res => {
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
