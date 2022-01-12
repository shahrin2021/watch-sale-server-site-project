const express = require('express');
const app= express();
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const ObjectId= require('mongodb').ObjectId;
const fileUplode = require('express-fileupload');
const port = process.env.PORT || 5000;
// brandSalesWatch
// Il9uRHTVPFomEqyN
app.use(cors());
app.use(express.json())
app.use(fileUplode())

const uri = "mongodb+srv://brandSalesWatch:Il9uRHTVPFomEqyN@cluster0.qzrjh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });




async function run(){
    try{
        await client.connect();
        const database = client.db('brandedWatch');
        const productsCollection = database.collection('products');
        const ordersCollection = database.collection('orders');
        const usersCollection = database.collection('users');
        const reviewCollection = database.collection('reviews');
        console.log('databse connect')


        app.get('/products',async(req, res)=>{
            const cursor = productsCollection.find({});
            const result = await cursor.toArray();
            res.json(result)
        });


app.get('/products/:id',async(req, res)=>{
    const id = req.params.id;
    const query= {_id :ObjectId(id) }
    const result = await productsCollection.findOne(query);
    res.json(result)
});

app.post('/orders', async (req ,res)=>{
    const order = req.body;
    const result =await ordersCollection.insertOne(order) ;
    console.log(result)
    res.json(result)

});

app.get('/orders/:email', async (req,res)=>{
    const cursor = ordersCollection.find({email:req.params.email})
    const result = await cursor.toArray()
    res.json(result)
})

app.get('/orders', async (req,res)=>{
    const cursor = ordersCollection.find({})
    const result = await cursor.toArray()
    res.json(result)
});

// delete function 

app.delete('/orders/:id', async (req, res)=>{
    const id = req.params.id;
    const query = {_id: ObjectId(id)};
    const result = await ordersCollection.deleteOne(query );
    res.json(result)
})

// post user email password login

app.post('/users', async (req, res)=>{
    const user= req.body;
    const result = await usersCollection.insertOne(user);
    res.json(result)
})
app.get('/users', async(req, res)=>{
    const cursor = usersCollection.find({});
    const products = await cursor.toArray();
    res.json(products)

});

// review 

app.post('/reviews', async (req, res)=>{
    const user = req.body;
    console.log(user)
    const result = await reviewCollection.insertOne(user)
    res.json(result)
})

app.get('/reviews', async(req, res)=>{
    const cursor = reviewCollection.find({})
    const result = await cursor.toArray();
    res.json(result)
})

// update user for google login


app.put('/users', async(req, res)=>{
    const user= req.body;
    const filter = {email: user.email};
    const option = {upsert:true}
    const updateDoc={
        $set:user
    }
    const result = await usersCollection.updateOne(filter, updateDoc, option);
    res.json(result)
})

// Creat an admin 


app.put('/users/admin', async(req, res)=>{
    const user= req.body;
    console.log(user)
    const filter = {email: user.email};
    const option = {upsert:true}
    const updateDoc={
        $set:{role: 'admin'}
    }
    const result = await usersCollection.updateOne(filter, updateDoc,option);
    console.log(result)
    res.json(result)
});
app.post('products',async(req, res)=>{

    const id= req.body.id;
    const name= req.body.name;
    const price= req.body.price;
    const brand= req.body.brand;
    const gender= req.body.gender;
    const imdex= req.body.imdex;
    const material= req.body.material;
    const color= req.body.color;
    const diameter= req.body.diameter;
    const shape= req.body.shape;
    const image = req.files.image;
    const detail= req.body.detail;

    const imageData= image.data;
    const encodedImage= imageData.toString('base64');
    const imageBuffer= Buffer.from(encodedImage,('base64'))

    const product = {
        name:name,
        image:imageBuffer,
        id:id,
        brand:brand, 
        price:price,
        imdex:imdex, 
        color:color,
        detail:detail,
        shape:shape,
        material:material,
        gender:gender,
        diameter:diameter
    }

    const result = await productsCollection.insertOne(product)
    console.log(product)
    console.log('files' , req.files)
    res.json(result)
    
});



//  find admin via email 

app.get('/users/:email', async (req, res)=>{
    const email= req.params.email;
    const filter = {email: email};
    const user  = await usersCollection.findOne(filter)
    let isAdmin =false;
    if(user?.role === 'admin'){
        isAdmin=true;
    }
    console.log(isAdmin)
    res.json({admin:isAdmin})
});





    }finally{
// await client.close();
    }
}

run().catch(console.dir)



app.get('/',(req,res)=>{
    res.send('e-commerce server site')
});

app.listen(port, ()=>{
    console.log('listening port', port )
})