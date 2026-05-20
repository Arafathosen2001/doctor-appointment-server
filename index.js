const express = require('express');
const dotenv=require('dotenv');
const app = express();
const cors = require('cors');
dotenv.config();

app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT;
const uri = process.env.MONGODB_URI;

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
      await client.connect();
        const db = client.db('doctorAppointment');
        const collectionDoctor = db.collection('doctor');
        const collectionBokingDoctor = db.collection('appointments');
    app.get('/doctors', async(req,res) => {
        const result = await collectionDoctor.find().toArray();
        res.send(result);
    })
    app.get('/doctors/:did', async(req, res) => {
      const id = req.params.did
      console.log(id)
      const result = await collectionDoctor.findOne({ _id: new ObjectId(id) });
      res.send(result)
    })

    app.post('/appointments', async (req, res) => {
      const bokingDoctorData = req.body;
      const result = await collectionBokingDoctor.insertOne(bokingDoctorData)
      res.json(result)
      
    })

    



    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
