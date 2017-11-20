'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk');

AWS.config.update({ region: "eu-west-2" });
AWS.config.setPromisesDependency(require('bluebird'));

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {
    const bodyData = JSON.parse(event.body);
    const seller_name = bodyData.seller_name;
    const seller_email = bodyData.seller_email;
    const seller_address = bodyData.seller_address;
    const seller_phone = bodyData.seller_phone;


    if(typeof seller_name !== 'string' || typeof seller_email !== 'string' || typeof seller_address !== 'string'
        || typeof seller_phone !== 'number'){
        console.error('Bad stuff');
        callback(null, {
            statusCode: 400,
            headers: {'Content-Type': 'text/plain'},
            body: 'Bad stuff happened. Sry',
        });
    }

    submitSeller(sellerParams(seller_name, seller_email, seller_address, seller_phone))
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
                    message: 'Bad stuff when creating user'
                })
            })
        });
};

const submitSeller = seller => {
    console.log('Submitting auction');
    const auctionInfo = {
        TableName: process.env.SELLER_TABLE,
        Item: seller,
    };
    return dynamoDb.put(auctionInfo).promise()
        .then(res => seller);
};

const sellerParams = (seller_name, seller_email, seller_address, seller_phone) => {
    const timestamp = new Date().getTime();

    return {
        seller_id: uuid.v1(),
        seller_name: seller_name,
        seller_email: seller_email,
        seller_address: seller_address,
        seller_phone: seller_phone,
        createdAt: timestamp,
        updatedAt: timestamp
    }
};
