
import { MongoClient } from "mongodb";

const mongoUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017';
const mongoDbName = process.env.MONGO_DB || 'AIMS_local';

let mongoClient;
let jobsCollection;
let companyCategoryCollection;
let skillsCategoryCollection;
let personalInfoCollection;

async function initMongo() {
    mongoClient = new MongoClient(mongoUrl);
    await mongoClient.connect();
    const db = mongoClient.db(mongoDbName);
    jobsCollection = db.collection('job_market');
    companyCategoryCollection = db.collection('company_category');
    skillsCategoryCollection = db.collection('skills_category');
    personalInfoCollection = db.collection('personal_info');
    console.log('Connected to MongoDB', mongoUrl, 'DB:', mongoDbName);
}

export {
    initMongo,
    jobsCollection,
    companyCategoryCollection,
    skillsCategoryCollection,
    personalInfoCollection
};
