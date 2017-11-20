'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk');

AWS.config.update({ region: "eu-west-2" });
AWS.config.setPromisesDependency(require('bluebird'));

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.get = (event, context, callback) => {
    let params = {
        TableName: process.env.AUCTIONS_TABLE,
        ProjectionExpression: "uuid, product_name, description, unix_end_time, created_at, category, image, seller_id, bids"
    };

    console.log('Getting the stuff');
    const onScan = (err, data) =>{
        if (err) {
            console.log('Bad stuff: ', JSON.stringify(err, null, 2));
            callback(err);
        } else {
            console.log('Good stuff');
            return callback(null, {
                statusCode: 200,
                body: JSON.stringify({
                    auctions: data.Items
                })
            })
        }
    };

    dynamoDb.scan(params, onScan);
};
