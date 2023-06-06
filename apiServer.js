const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;
app.use(bodyParser.json());
app.use(cors());

const DB_NAME = 'assignment3';
const COLLECTION_NAME = 'recordings';

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://charithprsg:5BehlieM4jIIXoOx@cluster0.kk0f3zv.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('COIT20269 Assignment 3 Server')
});

// API for receive data from the mobile app
app.post('/recording', async (req, res) => {
  var dataArray = req.body;
  if(dataArray.length > 0){
    try {
      // save data in mongodb
      await client.connect();
      const collection = client.db(DB_NAME).collection(COLLECTION_NAME);
      await collection.insertMany(dataArray);
      console.log("Message: " + dataArray.length + " recordings inserted");
      res.json({ message: 'Data saved successfully', data: "" });
    } catch (err) {
      console.error('error', err.stack);
      res.status(500).json({ error: err.stack });
    } finally {
      await client.close();
    }
  }
  else{
    console.log("Message: no data received");
    res.json({ message: 'error', data: "no data found" });
  }
});

// API for get data for mobile app
app.get('/recording', async (req, res) => {
  try {
    // get data from mongodb
    await client.connect();
    const collection = client.db(DB_NAME).collection(COLLECTION_NAME);
    const recordings = await collection.find().toArray();
    console.log("Message: recordings returned");
    res.json({ message: 'success', data: recordings });
  } catch (err) {
    console.error('error', err.stack);
    res.status(500).json({ error: err.stack });
  } finally {
    await client.close();
  }
});

// API for delete cloud data
app.delete('/recording', async (req, res) => {
  try {
    // delete data from mongodb
    await client.connect();
    const collection = client.db(DB_NAME).collection(COLLECTION_NAME);
    const recordings = await collection.deleteMany({});
    console.log("Message: recordings deleted");
    res.json({ message: 'Data deleted successfully', data: "" });
  } catch (err) {
    console.error('error', err.stack);
    res.status(500).json({ error: err.stack });
  } finally {
    await client.close();
  }
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Example app listening on port ${port}`)
});