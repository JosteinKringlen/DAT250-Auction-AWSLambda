'use strict';

import AWS from 'aws-sdk';
import uuid from 'uuid';

AWS.config.setPromisesDependency(require('bluebird'));

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {
    const bodyData = JSON.parse(event.body);
    const user_id = bodyData.user_id;
    const title = bodyData.title;
    const description= bodyData.description;
    const startingPrice = bodyData.startingPrice;

    if(typeof user_id !== 'string' || typeof title !== 'string' || typeof description !== 'string'
    || typeof startingPrice !== 'number'){
        console.error('Bad stuff');
        callback(null, {
            statusCode: 400,
            headers: {'Content-Type': 'text/plain'},
            body: 'Bad stuff happened. Sry',
        });
    }

    submitAuction(auctionParams(title, description, startingPrice, user_id))
        .then(res => {
            callback(null, {
                statusCode: 200,
                body: JSON.stringify({
                    message: 'Good stuff',
                    title: res.title
                })
            });
        })
        .catch(err => {
           console.log(err);
           callback(null, {
               statusCode: 500,
               body: JSON.stringify({
                   message: 'Bad stuff when creating auction'
               })
           })
        });
};

const submitAuction = auction => {
    console.log('Submitting auction');
    const auctionInfo = {
        TableName: process.env.AUCTION_TABLE,
        Item: auction,
    };
    return dynamoDb.put(auctionInfo).promise()
        .then(res => auction);
};

const auctionParams = (title, description, startingPrice, user_id) => {
    const timestamp = new Date().getTime();
    return {
        id: uuid.v1(),
        user_id: user_id,
        title: title,
        description: description,
        startingPrice: startingPrice,
        createdAt: timestamp,
        updatedAt: timestamp,
    }
}
