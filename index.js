const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
require('dotenv').config();
const { query } = require('express');

app.use(express.static('front'))


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
        const gamification_SettingsCollection = client.db('experiment-labs').collection('gamification_Settings');
        const earnings_logicCollection = client.db('experiment-labs').collection('earnings_logic');
        const item_earning_parameterCollection = client.db('experiment-labs').collection('item_earning_parameter');
        const item_redemption_parameter_internalCollection = client.db('experiment-labs').collection('item_redemption_parameter_internal');

        const courseCollection = client.db('experiment-labs').collection('courses');

        const chapterCollection = client.db('experiment-labs').collection('chapters');


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
        });

        app.get('/createOrganization', async (req, res) => {
            const query = {}
            const allorg = await orgCollection.find(query).toArray();

            res.send(allorg);
        });


        app.get('/createOrganization', async (req, res) => {
            const query = {}
            const allorg = await orgCollection.find(query).toArray();

            res.send(allorg);
        });

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
        app.post('/login', async (req, res) => {
            const user = req.body;
            console.log(user);

            let email = await orgCollection.findOne({ email: user.email });

            if (email) {
                return res.send({ role: "admin" });
            }
            return res.send({ role: "user" });
        });

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
            if (type != "admin") {
                const filter = {
                    org_id: id,
                    user_email: userEmai,
                    user_type: type
                }
                const result = await userdetailsCollection.insertOne(filter);
                res.send(result)
            }
            const result = await userdetailsCollection.insertOne(filter);
            res.send(result)




        });

        //add to organization by new user
        // app.post('/addToOrganizationBynewadmin', async (req, res) => {
        //     let query = {};
        //     const email = req.query.email;

        //     const user = req.body;

        //     let adminEmail = await userdetailsCollection.findOne({ user_email: email });


        //     /* if (!adminEmail) {
        //         return res.status(400).json({ error: " admin not found" })
        //     } */
        //     let newAdmin = await userdetailsCollection.findOne({ user_type: "admin", user_email: email });
        //     if (!newAdmin) {
        //         return res.status(400).json({ error: " admin not found" })
        //     }
        //     const id = user.org_id;

        //     let org_id = await orgCollection.findOne({ org_id: id });
        //     if (!org_id) {
        //         return res.status(400).json({ error: " Organization id not found" })
        //     }

        //     let actEmail = await userCollection.findOne({ email: user.user_email });
        //     if (!actEmail) {
        //         return res.status(400).json({ error: "sorry user not found" })
        //     }
        //     let checkUser = await userdetailsCollection.findOne({ user_email: user.user_email });
        //     if (checkUser) {
        //         return res.status(400).json({ error: "sorry a user already exixts" })
        //     }
        //     const userEmai = user.user_email;
        //     const type = user.user_type;
        //     const filter = {
        //         org_id: id,
        //         user_email: userEmai,
        //         user_type: type
        //     }
        //     const result = await userdetailsCollection.insertOne(filter);
        //     res.send(result)
        // })



        // //add redeem_categories
        // app.post('/redeem_categories', async (req, res) => {
        //     const user = req.body;
        //     const result = await redeem_categoriesCollection.insertOne(user);
        //     res.send(result)
        // });


        // app.get('/redeem_categories', async (req, res) => {
        //     const query = {}
        //     const redeem_categories = await redeem_categoriesCollection.find(query).toArray();
        //     res.send(redeem_categories);
        // });



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


        //create Gamification_Settings
        app.post('/gamification_settings', async (req, res) => {
            const settings = req.body;
            const result = await gamification_SettingsCollection.insertOne(settings);
            res.send(result)
        });


        app.get('/gamification_settings', async (req, res) => {
            const query = {}
            const settings = await gamification_SettingsCollection.find(query).toArray();
            res.send(settings);
        });


        //earnings_logic
        app.post('/earnings_logic', async (req, res) => {
            const earnings_logic = req.body;
            const result = await earnings_logicCollection.insertOne(earnings_logic);
            res.send(result)
        });


        app.get('/earnings_logic', async (req, res) => {
            const query = {}
            const earnings_logic = await earnings_logicCollection.find(query).toArray();
            res.send(earnings_logic);
        });

        //item_earning_parameter
        app.post('/item_earning_parameter', async (req, res) => {
            const item_earning_parameter = req.body;
            const result = await item_earning_parameterCollection.insertOne(item_earning_parameter);
            res.send(result)
        });


        app.get('/item_earning_parameter', async (req, res) => {
            const query = {}
            const item_earning_parameter = await item_earning_parameterCollection.find(query).toArray();
            res.send(item_earning_parameter);
        });


        //redemption_logic
        app.post('/redemption_logic', async (req, res) => {
            const user = req.body;
            const result = await redeem_categoriesCollection.insertOne(user);
            res.send(result)
        });


        app.get('/redemption_logic', async (req, res) => {
            const query = {}
            const redeem_categories = await redeem_categoriesCollection.find(query).toArray();
            res.send(redeem_categories);
        });


        //item_redemption_parameter_internal
        app.post('/item_redemption_parameter_internal', async (req, res) => {
            const item_redemption_parameter_internal = req.body;
            const result = await item_redemption_parameter_internalCollection.insertOne(item_redemption_parameter_internal);
            res.send(result)
        });


        app.get('/item_redemption_parameter_internal', async (req, res) => {
            const query = {}
            const item_redemption_parameter_internal = await item_redemption_parameter_internalCollection.find(query).toArray();
            res.send(item_redemption_parameter_internal);
        });

        //get courses
        app.get('/courses', async (req, res) => {
            const query = {}
            const courses = await courseCollection.find(query).toArray();
            res.send(courses);
        });

        //get courses by id
        app.get('/courses/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const filter = { _id: new ObjectId(id) };
            const course = await courseCollection.findOne(filter);
            console.log(course);
            res.send(course);
        });

        //add courses
        app.post('/courses', async (req, res) => {
            const course = req.body;
            const result = await courseCollection.insertOne(course);
            const id = result.insertedId;
            const chapter = {
                "courseId": id,
                "chapterName": "Topic 1",
                "creator": course?.creator,
                "date": new Date()
            };
            const newChapter = await chapterCollection.insertOne(chapter);
            res.send({
                "course --->": result,
                "chapter --->": newChapter
            })
        });


        //get chapters
        app.get('/chapters', async (req, res) => {
            const query = {};
            const chapters = await chapterCollection.find(query).toArray();
            res.send(chapters);
        });


        //get chapter
        app.get('/chapters/:id', async (req, res) => {
            const id = req.params.id;
            const query = { courseId: id };
            const chapters = await chapterCollection.find(query).toArray();
            res.send(chapters);
        });

        //add chapter
        app.post('/chapters', async (req, res) => {
            const chapter = req.body;
            const result = await chapterCollection.insertOne(chapter);
            res.send(result)
        });

        //Rename chapters
        app.put('/chapters/:id', async (req, res) => {
            const id = req.params.id;
            const chapterName = req.body.chapterName;
            const filter = { _id: new ObjectId(id) };

            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    chapterName: chapterName
                }
            };
            const result = await chapterCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
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