
// password = admin
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const password = "admin";

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://vegetableSeller:admin@vegetableseller.boykaag.mongodb.net/?retryWrites=true&w=majority&appName=vegetableSeller";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(cors());

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

app.post('/addProduct', async (req, res) => {
  try {
      await client.connect();
      const productCollection = client.db("vegetableShop").collection("products");
      const product = req.body;
      await productCollection.insertOne(product);
      res.redirect('/');
  } catch (err) {
      console.error(err);
      res.status(500).send("Error adding product");
  }
});

app.use('/products', (req, res, next) => {
  console.log('Request to /products:', req.method, req.url);
  next();
});

app.get('/products', (req, res)=> {
  const productCollection = client.db("vegetableShop").collection("products");
  productCollection.find({}).toArray((err, docs) => {
    if (err) {
      console.error("Error fetching products:", err);
      res.status(500).send("Error fetching products");
    } else {
      console.log(docs);
      res.send(docs);
    }
  });
});



app.listen(process.env.PORT || 3000);

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("vegetableShop").command({ ping: 1 });
    // const db = client.db("vegetableShop");
    // const coll = db.collection("products");

    // find code goes here
    // const cursor = coll.find();
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    // iterate code goes here
    // await cursor.forEach(console.log);

  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
   
  }
}
run().catch(console.dir);
