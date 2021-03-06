'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk');

AWS.config.update({ region: "eu-west-2" });
AWS.config.setPromisesDependency(require('bluebird'));

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {
    const bodyData = JSON.parse(event.body);
    const seller_id = bodyData.seller_id;
    const product_name = bodyData.product_name;
    const min_price = bodyData.min_price;
    const description = bodyData.description;
    const category = bodyData.category;
    const image = bodyData.image;
    const duration_days = parseInt(bodyData.duration_days);

    if(typeof seller_id !== 'string' || typeof product_name !== 'string'
    || typeof description !== 'string'|| typeof min_price !== 'string'
    || typeof category !== 'string' || typeof image !== 'string'
    /*|| typeof duration_days !== 'string'*/){
        return callback(null, {
            statusCode: 400,
            body: 'Bad request. Invalid value for one of the inputs',
        });
    }

    submitAuction(auctionParams(product_name, min_price, description, category, image, duration_days, seller_id))
        .then(res => {
            callback(null, {
                statusCode: 200,
                headers: {
                    "Access-Control-Allow-Origin" : "*"
                },
                body: JSON.stringify({
                    message: 'Auction created successfully',
                    auction_id: res.auction_id
                })
            });
        })
        .catch(err => {
           console.log(err);
           callback(null, {
               statusCode: 500,
               body: JSON.stringify({
                   message: 'Error when creating auction',
                   error: err
               })
           })
        });
};

const submitAuction = auction => {
    const auctionInfo = {
        TableName: process.env.AUCTION_TABLE,
        Item: auction,
    };
    return dynamoDb.put(auctionInfo).promise().then(res => auction);
};

const auctionParams = (product_name, min_price, description, category, image, duration_days, seller_id) => {
    const now = new Date();
    const timestamp = now.getTime();
    const unix_end_time = now.setDate(now.getDate() + duration_days);
    return {
        auction_id: uuid.v1(),
        product_name: product_name,
        min_price: min_price,
        description: description,
        created_at: timestamp,
        updated_at: timestamp,
        bids: [],
        category: category,
        image: image,
        seller_id: seller_id,
        unix_end_time: unix_end_time
    }
};
