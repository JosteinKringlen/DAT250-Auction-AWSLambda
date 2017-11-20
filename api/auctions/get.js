'use strict';

import AWS from 'aws-sdk';
import uuid from 'uuid';

AWS.config.setPromisesDependency(require('bluebird'));

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.get = (event, context, callback) => {
    let params = {
        TableName: process.env.AUCTIONS_TABLE,
        ProjectionExpression: "user_id, title, description"
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