'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk');

AWS.config.update({ region: "eu-west-2" });
AWS.config.setPromisesDependency(require('bluebird'));

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.get = (event, context, callback) => {
    let params = {
        TableName: process.env.AUCTION_TABLE,
        ProjectionExpression: "auction_id, product_name, description, unix_end_time, created_at, category, image, seller_id, bids, min_price"
    };

    const onScan = (err, data) => {
        if (err) {
            callback(err);
        } else {
            var date = new Date();
            var activeAuctions = data.Items.filter(auction => auction.unix_end_time > date.getTime())
            activeAuctions.sort((a,b) => a.unix_end_time - b.unix_end_time);
            return callback(null, {
                statusCode: 200,
                headers: {
                    "Access-Control-Allow-Origin" : "*"
                },
                body: JSON.stringify({
                    auctions: activeAuctions
                })
            })
        }
    };

    dynamoDb.scan(params, onScan);
};
