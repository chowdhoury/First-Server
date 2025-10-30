const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to Espresso Emporium");
});

const uri =
  "mongodb+srv://adminDB:FdWu2EG4GSLOAQqz@chowdhoury.6j2rpnl.mongodb.net/?appName=chowdhoury";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const coffeeDB = client.db("coffeeDB");
    const coffeeCollection = coffeeDB.collection("coffee");

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    app.get("/coffee", async (req, res) => {
      const cursor = coffeeCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });

      app.get('/coffee/:id', async (req, res) => {
        //   console.log(req.params.id);
          const query = { _id: new ObjectId(req.params.id) }
          const result = await coffeeCollection.findOne(query)
          res.send(result)
    })

    app.post("/coffee", async (req, res) => {
      //   console.log(req.body)
      const newCoffee = req.body;
      const result = await coffeeCollection.insertOne(newCoffee);
      res.send(result);
    });
      
      app.patch('/coffee/:id',async (req, res) => {
          console.log(req.params.id);
          const updatedCoffee = req.body;
          const query = { _id: new ObjectId(req.params.id) }
          const update = {
            $set: {
              name: updatedCoffee.name,
              supplier:updatedCoffee.supplier,
              category:updatedCoffee.category,
              chef:updatedCoffee.chef,
              taste:updatedCoffee.taste,
              details:updatedCoffee.details,
              photo:updatedCoffee.photo,
            },
          };
          const result = await coffeeCollection.updateOne(query, update);
          res.send(result)
      })

    app.delete("/coffee/:id", async (req, res) => {
      //   console.log(req.params)
      const query = { _id: new ObjectId(req.params.id) };
      const result = await coffeeCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
