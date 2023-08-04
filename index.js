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



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.avm9c.mongodb.net/?retryWrites=true&w=majority`;


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
        const orgCollection = client.db('experiment-labs').collection('organizations');
        const userCollection = client.db('experiment-labs').collection('users');
        const userdetailsCollection = client.db('experiment-labs').collection('userdetails');
        const redeem_categoriesCollection = client.db('experiment-labs').collection('redeem_categories');
        const gamification_SettingsCollection = client.db('experiment-labs').collection('gamification_Settings');
        const earnings_logicCollection = client.db('experiment-labs').collection('earnings_logic');
        const item_earning_parameterCollection = client.db('experiment-labs').collection('item_earning_parameter');
        const item_redemption_parameter_internalCollection = client.db('experiment-labs').collection('item_redemption_parameter_internal');

        const courseCollection = client.db('experiment-labs').collection('courses');

        const chapterCollection = client.db('experiment-labs').collection('chapters');

        const weekCollection = client.db('experiment-labs').collection('weeks');

        const testCollection = client.db('experiment-labs').collection('test');

        const assignmentCollection = client.db('experiment-labs').collection('assignments');

        const skillCategoryCollection = client.db('experiment-labs').collection('skillCategories');







        app.post('/test', async (req, res) => {
            const user = req.body;
            const result = await testCollection.insertOne(user);
            res.send(result)
        });



        //find user
        app.get('/users', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const user = await userCollection.findOne(query);
            res.send(user);
        });


        //create user
        app.post('/users', async (req, res) => {
            const user = req.body;

            const email = await userCollection.findOne({ email: user.email });

            if (email) {
                return res.status(400).json({ error: "sorry a user already exists" });
            }

            const result = await userCollection.insertOne(user);
            res.send(result);
        });


        // create organization
        app.post('/organizations', async (req, res) => {
            const user = req.body;
            const result = await orgCollection.insertOne(user);
            const organizationId = result.insertedId;
            const email = user.email;

            const filter = { email: email };

            const options = { upsert: true };

            const updatedDoc = {
                $set: {
                    organizationId: "" + organizationId,
                    organizationName: "" + user?.organizationName,
                    role: "Admin"
                }
            };

            const newResult = await userCollection.updateOne(filter, updatedDoc, options);

            res.send({ result, newResult });
        });

        // app.get('/createOrganization', async (req, res) => {
        //     const query = {}
        //     const allorg = await orgCollection.find(query).toArray();
        //     res.send(allorg);
        // });


        // app.get('/createOrganization', async (req, res) => {
        //     const query = {}
        //     const allorg = await orgCollection.find(query).toArray();
        //     res.send(allorg);
        // });



        // //login
        // app.post('/login', async (req, res) => {
        //     const user = req.body;
        //     // console.log(user);

        //     let email = await orgCollection.findOne({ email: user.email });

        //     if (email) {
        //         return res.send({ role: "admin" });
        //     }
        //     return res.send({ role: "user" });
        // });

        // // add to organization a user
        // app.post('/addToOrganization', async (req, res) => {
        //     let query = {};
        //     const email = req.query.email;

        //     const user = req.body;
        //     const id = user.org_id;

        //     let adminEmail = await orgCollection.findOne({ email: email, org_id: id });

        //     if (!adminEmail) {
        //         return res.status(400).json({ error: " admin not found" })
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
        //     if (type != "admin") {
        //         const filter = {
        //             org_id: id,
        //             user_email: userEmai,
        //             user_type: type
        //         }
        //         const result = await userdetailsCollection.insertOne(filter);
        //         res.send(result)
        //     }
        //     const result = await userdetailsCollection.insertOne(filter);
        //     res.send(result)




        // });

        // //add to organization by new user
        // // app.post('/addToOrganizationBynewadmin', async (req, res) => {
        // //     let query = {};
        // //     const email = req.query.email;

        // //     const user = req.body;

        // //     let adminEmail = await userdetailsCollection.findOne({ user_email: email });


        // //     /* if (!adminEmail) {
        // //         return res.status(400).json({ error: " admin not found" })
        // //     } */
        // //     let newAdmin = await userdetailsCollection.findOne({ user_type: "admin", user_email: email });
        // //     if (!newAdmin) {
        // //         return res.status(400).json({ error: " admin not found" })
        // //     }
        // //     const id = user.org_id;

        // //     let org_id = await orgCollection.findOne({ org_id: id });
        // //     if (!org_id) {
        // //         return res.status(400).json({ error: " Organization id not found" })
        // //     }

        // //     let actEmail = await userCollection.findOne({ email: user.user_email });
        // //     if (!actEmail) {
        // //         return res.status(400).json({ error: "sorry user not found" })
        // //     }
        // //     let checkUser = await userdetailsCollection.findOne({ user_email: user.user_email });
        // //     if (checkUser) {
        // //         return res.status(400).json({ error: "sorry a user already exixts" })
        // //     }
        // //     const userEmai = user.user_email;
        // //     const type = user.user_type;
        // //     const filter = {
        // //         org_id: id,
        // //         user_email: userEmai,
        // //         user_type: type
        // //     }
        // //     const result = await userdetailsCollection.insertOne(filter);
        // //     res.send(result)
        // // })



        // // //add redeem_categories
        // // app.post('/redeem_categories', async (req, res) => {
        // //     const user = req.body;
        // //     const result = await redeem_categoriesCollection.insertOne(user);
        // //     res.send(result)
        // // });


        // // app.get('/redeem_categories', async (req, res) => {
        // //     const query = {}
        // //     const redeem_categories = await redeem_categoriesCollection.find(query).toArray();
        // //     res.send(redeem_categories);
        // // });



        // app.get('/addToOrganization', async (req, res) => {
        //     const query = {}
        //     const categories = await userdetailsCollection.find(query).toArray();

        //     res.send(categories);
        // });





        // //create Gamification_Settings
        // app.post('/gamification_settings', async (req, res) => {
        //     const settings = req.body;
        //     const result = await gamification_SettingsCollection.insertOne(settings);
        //     res.send(result)
        // });


        // app.get('/gamification_settings', async (req, res) => {
        //     const query = {}
        //     const settings = await gamification_SettingsCollection.find(query).toArray();
        //     res.send(settings);
        // });


        // //earnings_logic
        // app.post('/earnings_logic', async (req, res) => {
        //     const earnings_logic = req.body;
        //     const result = await earnings_logicCollection.insertOne(earnings_logic);
        //     res.send(result)
        // });


        // app.get('/earnings_logic', async (req, res) => {
        //     const query = {}
        //     const earnings_logic = await earnings_logicCollection.find(query).toArray();
        //     res.send(earnings_logic);
        // });

        // //item_earning_parameter
        // app.post('/item_earning_parameter', async (req, res) => {
        //     const item_earning_parameter = req.body;
        //     const result = await item_earning_parameterCollection.insertOne(item_earning_parameter);
        //     res.send(result)
        // });


        // app.get('/item_earning_parameter', async (req, res) => {
        //     const query = {}
        //     const item_earning_parameter = await item_earning_parameterCollection.find(query).toArray();
        //     res.send(item_earning_parameter);
        // });


        // //redemption_logic
        // app.post('/redemption_logic', async (req, res) => {
        //     const user = req.body;
        //     const result = await redeem_categoriesCollection.insertOne(user);
        //     res.send(result)
        // });


        // app.get('/redemption_logic', async (req, res) => {
        //     const query = {}
        //     const redeem_categories = await redeem_categoriesCollection.find(query).toArray();
        //     res.send(redeem_categories);
        // });


        // //item_redemption_parameter_internal
        // app.post('/item_redemption_parameter_internal', async (req, res) => {
        //     const item_redemption_parameter_internal = req.body;
        //     const result = await item_redemption_parameter_internalCollection.insertOne(item_redemption_parameter_internal);
        //     res.send(result)
        // });


        // app.get('/item_redemption_parameter_internal', async (req, res) => {
        //     const query = {}
        //     const item_redemption_parameter_internal = await item_redemption_parameter_internalCollection.find(query).toArray();
        //     res.send(item_redemption_parameter_internal);
        // });

        //get courses 
        app.get('/courses', async (req, res) => {
            const query = {}
            const courses = await courseCollection.find(query).toArray();
            res.send(courses);
        });

        //get courses by id 
        app.get('/courses/:id', async (req, res) => {
            const id = req.params.id;
            //console.log(id);
            const filter = { _id: new ObjectId(id) };
            const course = await courseCollection.findOne(filter);
            // console.log(course);
            res.send(course);
        });

        //add courses
        app.post('/courses', async (req, res) => {
            const course = req.body;
            const result = await courseCollection.insertOne(course);
            const courseId = result.insertedId;
            const week = {
                courseId: "" + courseId,
                weekNo: 1,
                weekName: "Week Name",
                organization: course?.organization,
                creator: course?.creator
            };
            const newResult = await weekCollection.insertOne(week);
            const weekId = newResult.insertedId;
            const chapter = {
                courseId: "" + courseId,
                weekId: "" + weekId,
                chapterName: "Topic 1",
                creator: course?.creator,
                date: new Date(),
                tasks: []
            };
            const newChapter = await chapterCollection.insertOne(chapter);
            res.send({
                "week": newResult,
                "course": result,
                "chapter": newChapter
            });
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
            console.log(id);
            const query = { weekId: id };
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


        // add week To be done
        app.post('/weeks', async (req, res) => {
            const data = req.body;
            const courseId = data.courseId;
            const creator = data.creator;
            const organization = data.organization;
            const week = {
                courseId: "" + courseId,
                weekName: data.weekName,
                creator: creator,
                organization: organization
            };
            const newResult = await weekCollection.insertOne(week);
            const weekId = newResult.insertedId;
            const chapter = {
                courseId: "" + courseId,
                weekId: "" + weekId,
                chapterName: "Topic 1",
                creator: creator,
                date: new Date(),
                tasks: []
            };
            const newChapter = await chapterCollection.insertOne(chapter);

            res.send({
                "week": newResult,
                "chapter": newChapter
            });
        });


        //get week by courseId
        app.get('/weeks/:id', async (req, res) => {
            const courseId = req.params.id;
            const query = { courseId: courseId };
            const courses = await weekCollection.find(query).toArray();
            res.send(courses);
        });

        //Rename weeks
        app.put('/weeks/:id', async (req, res) => {
            const id = req.params.id;
            const weekName = req.body.weekName;
            const filter = { _id: new ObjectId(id) };

            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    weekName: weekName
                }
            };
            const result = await weekCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        });


        //delete week by weekId
        app.delete('/weeks/:id', async (req, res) => {
            const weekId = req.params.id;
            const query = { _id: new ObjectId(weekId) };
            const result = await weekCollection.deleteOne(query);
            res.send(result);
        });


        //Assignment
        app.post('/assignments/:id', async (req, res) => {
            const chapterId = req.params.id;
            const assignment = req.body;
            const result = await assignmentCollection.insertOne(assignment);

            const filter = { _id: new ObjectId(chapterId) };
            const options = { upsert: true };

            const newTask = {
                taskId: "" + result?.insertedId,
                taskType: "Assignment"
            };

            const updatedDoc = {
                $push: {
                    tasks: newTask
                }
            };

            const newResult = await chapterCollection.updateOne(filter, updatedDoc, options);

            res.send({ result, newResult });
        });


        //get Assignment by id
        app.get('/assignments/:id', async (req, res) => {
            const assignmentId = req.params.id;
            const query = { _id: new ObjectId(assignmentId) };
            const assignment = await assignmentCollection.findOne(query);
            res.send(assignment);
        });


        //Create category
        app.post('/skill_categories/:id', async (req, res) => {
            const category = req.body;
            const organizationId = req.params.id;
            const filter = { organizationId: organizationId };
            const result = await skillCategoryCollection.findOne(filter);

            if (!result) {
                const newData = await skillCategoryCollection.insertOne(
                    {
                        organizationId: organizationId,
                        categories: [
                            category
                        ]
                    }
                )

                res.send(newData);
            }

            else {
                const options = { upsert: true };

                const updatedDoc = {
                    $push: {
                        categories: category
                    }
                };

                const newResult = await skillCategoryCollection.updateOne(filter, updatedDoc, options);

                res.send(newResult);
            }
        });


        //Create category
        app.get('/skill_categories/:id', async (req, res) => {
            const organizationId = req.params.id;
            const filter = { organizationId: organizationId };
            const result = await skillCategoryCollection.findOne(filter);
            res.send(result);
        });



        //Create category
        app.post('/skills', async (req, res) => {
            const skillData = req.body;

            const options = { upsert: true };

            const filter = {
                organizationId: skillData.organizationId,
                categories: {
                    $elemMatch: { categoryName: skillData.categoryName },
                },
            };

            const update = {
                $push: { "categories.$.skill": skillData.skill },
            };

            const result = await skillCategoryCollection.updateOne(filter, update, options);

            res.send(result);
        });





        // //get week by courseId
        // app.get('/assignments/:id', async (req, res) => {
        //     const courseId = req.params.id;
        //     const query = { courseId: courseId };
        //     const courses = await weekCollection.find(query).toArray();
        //     res.send(courses);
        // });


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