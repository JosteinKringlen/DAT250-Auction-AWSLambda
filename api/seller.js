'use strict';

import AWS from 'aws-sdk';
import uuid from 'uuid';

AWS.config.setPromisesDependency(require('bluebird'));

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {

};

module.exports.get = (event, context, callback) => {

};

module.exports.bids = (event, context, callback) => {

};

module.exports.edit = (event, context, callback) => {

};

module.exports.delete = (event, context, callback) => {

};