import Mongodb from 'mongo-mock';
const MongoClient = Mongodb.MongoClient;
MongoClient.persist="mongo.js";

export default MongoClient;
