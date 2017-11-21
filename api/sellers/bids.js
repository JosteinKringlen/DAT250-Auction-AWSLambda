'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk');

AWS.config.update({region: "eu-west-2"});
AWS.config.setPromisesDependency(require('bluebird'));

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.bids = (event, context, callback) => {

    const _seller_id = event.pathParameters.seller_id;

    let auctionParams = {
        TableName: process.env.AUCTION_TABLE,
        ProjectionExpression: "auction_id, bids",
    };

    console.log('Getting the stuff');
    let auctions = {};
    let sellerAuctions = [];
    const onScan = (err, data) => {
        if (err) {
            console.log('Bad stuff: ', JSON.stringify(err, null, 2));
            callback(err);
        } else {
            auctions = data.Items;
            auctions.forEach(function (item) {
                if (item.bids.length >=1 ){
                    for (let i = 0; i < item.bids.length; i++){
                        if (item.bids[i].bidder_id === _seller_id){
                            sellerAuctions.push({
                                auction_id: item.auction_id,
                                seller_bid: item.bids[i].newBid
                            })
                        }
                    }
                }
            });
            sellerAuctions.forEach(function (item) {
               console.log(item);
            });
            return callback(null, {
               statusCode: 200,
               body: sellerAuctions
            })
        }
    };
    dynamoDb.scan(auctionParams, onScan);

};
