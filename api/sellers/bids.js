'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk');

AWS.config.update({ region: "eu-west-2" });
AWS.config.setPromisesDependency(require('bluebird'));

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.bids = (event, context, callback) => {
    let auctionParams = {
        TableName: process.env.AUCTION_TABLE,
        ProjectionExpression: "auction_id, bids",
    };

   /* let sellerParams = {
        TableName: process.env.SELLER_TABLE,
        Key: {
            seller_id: event.pathParameters.seller_id,
        }
    };*/

    console.log('Getting the stuff');
    /*const onScan = (err, data) => {
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
    */
    let auctions = {};
    const onScan = (err, data) => {
        if(err){
            console.log('Bad stuff: ', JSON.stringify(err, null, 2));
            callback(err);
        } else {
             auctions = {
                 stuff: data.Items,
             };
             console.log(auctions.stuff);
        }
    };

    /*dynamoDb.get(params).promise().then(res => {
        const result = {
            statusCode: 200,
            body: JSON.stringify(res.Item)
        };
        callback(null,result);
    }).catch(err => {
        console.log(err);
        callback(null, err, 2);
    })*/
    dynamoDb.scan(auctionParams, onScan);

};
