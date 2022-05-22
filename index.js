const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
const port = 5000;


const uri = "mongodb+srv://dbuser1:VIDtPXVuRd4GoRGU@cluster0.vtwog.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
   try{
     await client.connect();
     const database = client.db("UsersInfo");
     const userdetails = database.collection("UserDetails");

     app.post('/user',async(req,res)=>{
      const userdata =req.body;
      const result = await userdetails.insertOne(userdata);
      res.json(result);
    });
    
   }
   finally{
     await client.close();
   }
}
run().catch(console.dir)
app.get('/',(req,res)=>{
    console.log("api connected");
    res.send("hello world");
});




app.listen(5000,()=>{
    console.log(port);
})