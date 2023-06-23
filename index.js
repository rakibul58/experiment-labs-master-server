const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const cors = require('cors');
require('dotenv').config();

const port = 5000

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Hello world')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.wt1rplg.mongodb.net/?retryWrites=true&w=majority`;

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
        const orgCollection = client.db('experiment-labs').collection('allorganization');
        const userCollection = client.db('experiment-labs').collection('allusers');
        const userdetailsCollection = client.db('experiment-labs').collection('userdetails');
        const redeem_categoriesCollection = client.db('experiment-labs').collection('redeem_categories');


        //create organization
        app.post('/createOrganization', async (req, res) => {
            const user = req.body;
            const id = user.org_id;
            let org_id = await orgCollection.findOne({ org_id: id });

            if (org_id) {
                return res.status(400).json({ error: "sorry a user already exixts" })
            }
            let org_email = await orgCollection.findOne({ email: user.email });

            if (org_email) {
                return res.status(400).json({ error: "sorry a user already exixts" })
            }
            const result = await orgCollection.insertOne(user);
            res.send(result)
        })

        //create user
        app.post('/createUser', async (req, res) => {
            const user = req.body;

            let email = await userCollection.findOne({ email: user.email });

            if (email) {
                return res.status(400).json({ error: "sorry a user already exixts" })
            }
            const result = await userCollection.insertOne(user);
            res.send(result)
        })

        //login
        app.get('/login', async (req, res) => {
            const user = req.body;

            let email = await orgCollection.findOne({ email: user.email, password: user.password });

            if (email) {
                return res.json({ "login successful": "admin" })
            }
            let useremail = await userCollection.findOne({ email: user.email, password: user.password });

            if (useremail) {
                return res.json({ "login successful": "user" })
            }

            else {
                return res.status(400).json({ error: " user not found" })
            }
            // const result = await usersCollection.insertOne(user);
            // res.send(result)
        })

        // add to organization a user
        app.post('/addToOrganization', async (req, res) => {
            let query = {};
            const email = req.query.email;

            const user = req.body;
            const id = user.org_id;

            let adminEmail = await orgCollection.findOne({ email: email, org_id: id });

            if (!adminEmail) {
                return res.status(400).json({ error: " admin not found" })
            }



            let actEmail = await userCollection.findOne({ email: user.user_email });
            if (!actEmail) {
                return res.status(400).json({ error: "sorry user not found" })
            }
            let checkUser = await userdetailsCollection.findOne({ user_email: user.user_email });
            if (checkUser) {
                return res.status(400).json({ error: "sorry a user already exixts" })
            }
            const userEmai = user.user_email;
            const type = user.user_type;
            const filter = {
                org_id: id,
                user_email: userEmai,
                user_type: type
            }
            const result = await userdetailsCollection.insertOne(filter);
            res.send(result)
        })

        //add to organization by new user
        app.post('/addToOrganizationBynewadmin', async (req, res) => {
            let query = {};
            const email = req.query.email;

            const user = req.body;

            let adminEmail = await userdetailsCollection.findOne({ user_email: email });


            /* if (!adminEmail) {
                return res.status(400).json({ error: " admin not found" })
            } */
            let newAdmin = await userdetailsCollection.findOne({ user_type: "admin", user_email: email });
            if (!newAdmin) {
                return res.status(400).json({ error: " admin not found" })
            }
            const id = user.org_id;

            let org_id = await orgCollection.findOne({ org_id: id });
            if (!org_id) {
                return res.status(400).json({ error: " Organization id not found" })
            }

            let actEmail = await userCollection.findOne({ email: user.user_email });
            if (!actEmail) {
                return res.status(400).json({ error: "sorry user not found" })
            }
            let checkUser = await userdetailsCollection.findOne({ user_email: user.user_email });
            if (checkUser) {
                return res.status(400).json({ error: "sorry a user already exixts" })
            }
            const userEmai = user.user_email;
            const type = user.user_type;
            const filter = {
                org_id: id,
                user_email: userEmai,
                user_type: type
            }
            const result = await userdetailsCollection.insertOne(filter);
            res.send(result)
        })

        //add redeem_categories
        app.post('/redeem_categories', async (req, res) => {
            const user = req.body;
            const result = await redeem_categoriesCollection.insertOne(user);
            res.send(result)
        })


        app.get('/addToOrganization', async (req, res) => {
            const query = {}
            const categories = await userdetailsCollection.find(query).toArray();

            res.send(categories);
        });


        //find user
        app.get('/user', async (req, res) => {
            let query = {};
            if (req.query.email) {
                query = {
                    user_email: req.query.email
                }
            }

            const collections = await userdetailsCollection.find(query).toArray();
            res.send(collections);
        });

        //user add


        /*  app.get('/users', async (req, res) => {
             const user = req.body;
             const result = await usersCollection.insertOne(user);
             res.send(result)
         }) */


        //organization add
        /*  app.post('/organizations', async (req, res) => {
             let query = {};
 
             const email = req.query.email;
 
             const user = req.body;
             let userEmail = await usersCollection.findOne({ email: email });
             if (!userEmail) {
                 return res.status(400).json({ error: " please create account" })
             }
             let orgId = await orgCollection.findOne({ org_id: user.org_id });
             if (orgId) {
                 return res.status(400).json({ error: "sorry a user already exixts" })
             }
             const id = user.org_id;
             const orgName = user.org_name;
             const admin = user.org_admin;
             const logo = user.org_logo;
             const filter = {
                 org_id: id,
                 email: email,
                 org_name: orgName,
                 admin: admin,
                 org_logo: logo
             }
             const result = await orgCollection.insertOne(filter);
             res.send(result)
         }) */



    } finally {
        // Ensures that the client will close when you finish/error
        //  await client.close();
    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})