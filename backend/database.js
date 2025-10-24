const  { MongoClient } = require('mongodb');

connectionString = "mongodb+srv://marker:mark123@imy220.0gytrcp.mongodb.net/?retryWrites=true&w=majority&appName=IMY220";
const client = new MongoClient(connectionString);

let db;

async function connectDB(){
    if (db) return db;

    try {
        await client.connect(); //opening a connection to mongodb server
        db = client.db("Zynthex");
        console.log("MongoDB Connected");

        //create the indexes
        await db.collection("users").createIndex({ username: 1 }, { unique: true });
        await db.collection("users").createIndex({ email: 1 }, { unique: true });
        await db.collection("projects").createIndex({ owner: 1 });

        return db;
        
    } catch (err) {
        console.error("MongoDB Connection error", err)
        throw err;
    }
}

//general query function
async function queryDB(collectionName, operation, data = {}){
    const db = await connectDB();
    const collection = db.collection(collectionName);
    try {
        switch (operation) {
            case 'find':
                return await collection.find(data.query || {}, data.options || {}).toArray();
            case 'insertOne':
                return await collection.insertOne(data.doc);
            case 'updateOne':
                return await collection.updateOne(data.filter, data.update, data.options || {});
            case 'deleteOne':
                return await collection.deleteOne(data.filter);
            case 'aggregate':
                return await collection.aggregate(data.pipeline || []).toArray();
            default:
                throw new Error('Invalid operation');
        }
    } catch (err) {
        console.error(`Error in ${operation} on ${collectionName}: `, err);
        throw err;
    }
}

module.exports = { connectDB, queryDB,};