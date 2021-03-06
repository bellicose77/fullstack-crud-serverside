const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
import path from 'path';
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname,'/build')));
const port = 5000;


const uri = "mongodb+srv://dbuser1:VIDtPXVuRd4GoRGU@cluster0.vtwog.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
   try{
     await client.connect();
     const database = client.db("UsersInfo");
     const userdetails = database.collection("UserDetails");

     app.get('/user', async(req,res)=>{
        const cursor = userdetails.find({});
        const users = await cursor.toArray();
        res.send(users);
     });
     app.get('/user/:id', async(req,res)=>{
       const id = req.params.id;
       const query = {_id:ObjectId(id)};
       const result = await userdetails.findOne(query);
       res.json(result);
       console.log("app i hitted",id);
     });

     app.post('/user',async(req,res)=>{
      const userdata =req.body;
      const result = await userdetails.insertOne(userdata);
      console.log("new user",result);
      res.json(result);
    });

    app.put('/user/:id', async(req,res)=>{
      const id = req.params.id;
      const updatedata = req.body;
      const filter = {_id: ObjectId(id)};
      const option = {upsert:true};
      const updateDoc = {
        $set: {
          name: updatedata.name,
          email:updatedata.email
        },
      };
      const result = await userdetails.updateOne(filter,updateDoc,option);
      res.json(result);
      // console.log("put api",id);
    })
 
    app.delete('/user/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await userdetails.deleteOne(query);
      res.json(result);
      // console.log("deleted hitted",result);
    })
    
   }
   finally{
     //await client.close();
   }
}
run().catch(console.dir);

app.listen(5000,()=>{
    console.log(port);
});
app.get('*',(req,res)=>{
  res.sendFile(path.join(__dirname + '/build/index.html'));
})