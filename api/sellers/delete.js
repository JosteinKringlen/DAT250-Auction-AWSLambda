'use strict';

import AWS from 'aws-sdk';
import uuid from 'uuid';

AWS.config.setPromisesDependency(require('bluebird'));

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.delete = (event, context, callback) => {


};