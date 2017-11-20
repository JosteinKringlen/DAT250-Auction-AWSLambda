'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk');

AWS.config.update({ region: "eu-west-2" });
AWS.config.setPromisesDependency(require('bluebird'));

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {
    const bodyData = JSON.parse(event.body);
    const name = bodyData.seller_name;
    const email = bodyData.seller_email;
    const address = bodyData.seller_adress;
    const phonenumber = bodyData.seller_phone;


    if(typeof name !== 'string' || typeof email !== 'string' || typeof address !== 'string'
        || typeof phonenumber !== 'number'){
        console.error('Bad stuff');
        callback(null, {
            statusCode: 400,
            headers: {'Content-Type': 'text/plain'},
            body: 'Bad stuff happened. Sry',
        });
    }

    submitSeller(sellerParams(name, email, address, phonenumber))
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

const sellerParams = (name, email, address, phonenumber) => {
    const timestamp = new Date().getTime();

    return {
        seller_id: uuid.v1(),
        name: name,
        email: email,
        address: address,
        phonenumber: phonenumber,
        createdAt: timestamp,
        updatedAt: timestamp
    }
};
