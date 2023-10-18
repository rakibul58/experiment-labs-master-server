const express = require('express')
const cors = require('cors');
const axios = require('axios');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
require('dotenv').config();
const { query } = require('express');

const nodemailer = require('nodemailer');
const nodeCron = require('node-cron');


const port = 5000

app.use(express.static('front'));
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
        const classCollection = client.db('experiment-labs').collection('classes');
        const readingCollection = client.db('experiment-labs').collection('readings');
        const quizCollection = client.db('experiment-labs').collection('quizes');
        const liveTestCollection = client.db('experiment-labs').collection('liveTests');
        const videoCollection = client.db('experiment-labs').collection('videos');
        const audioCollection = client.db('experiment-labs').collection('audios');
        const fileCollection = client.db('experiment-labs').collection('files');

        const skillCategoryCollection = client.db('experiment-labs').collection('skillCategories');

        const earningCategoryCollection = client.db('experiment-labs').collection('earningCategories');


        const assignmentSubmitCollection = client.db('experiment-labs').collection('assignments-submit');


        const eventCollection = client.db('experiment-labs').collection('events');
        const redemptionCategoryCollection = client.db('experiment-labs').collection('redemptionCategories');
        const redemptionAccessCollection = client.db('experiment-labs').collection('redemptionAccess');



        const batchCollection = client.db('experiment-labs').collection('batches');







        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD,
                clientId: process.env.OAUTH_CLIENTID,
                clientSecret: process.env.OAUTH_CLIENT_SECRET,
                refreshToken: process.env.OAUTH_REFRESH_TOKEN
            }
        });


        app.post('/sendMail', async (req, res) => {

            const data = req.body;
            console.log(transporter);
            const mailOptions = {
                from: data?.from,
                to: data?.to,
                subject: data?.subject + ` sent by ${data?.from}`,
                text: data?.message
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    res.send({ "Success": false });
                } else {
                    res.send({ "Success": true });
                }
            });



        });




        app.post('/test', async (req, res) => {
            const user = req.body;
            const result = await testCollection.insertOne(user);
            res.send(result)
        });


        app.get('/test', async (req, res) => {
            const filter = {};
            const result = await testCollection.find(filter).toArray();
            res.send(result)
        });

        app.put('/test', async (req, res) => {
            const data = req.body;
            res.send(data);
            console.log(data);
        });

        app.delete('/test/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const result = await testCollection.deleteOne(filter);
            res.send(result);
        })



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

            const batch = {
                batchName: "Batch 1",
                batchStartDate: "",
                batchEndDate: "",
                participants: [],
                courseId: "" + courseId,
                creator: course?.creator,
                organization: course?.organization
            };

            const batchResult = await batchCollection.insertOne(batch);

            const batchId = batchResult.insertedId;

            const week = {
                courseId: "" + courseId,
                weekNo: 1,
                weekName: "Week 1",
                organization: course?.organization,
                creator: course?.creator,
                schedules: [
                    {
                        weekStartDate: "",
                        weekEndDate: "",
                        batchId: "" + batchId,
                        batchName: "Batch 1"
                    }
                ]
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
                "chapter": newChapter,
                "batch": batchResult
            });
        });


        //get courses by organization id 
        app.get('/courses/organizations/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { "organization.organizationId": id };
            const course = await courseCollection.find(filter).toArray();
            res.send(course);
        });


        //batch
        app.get('/batches/courseId/:courseId', async (req, res) => {

            const courseId = req.params.courseId;
            const filter = { courseId: courseId };
            const result = await batchCollection.find(filter).toArray();
            res.send(result);

        });



        // {
        //     "user": {
        //         "participants": [
        //             {
        //                 "email": "user@gmail.com",
        //                 "name": "User",
        //                 "phone": "01643433981",
        //                 "password": "Experiment@123",
        //                 "organizationId": "64cbbd756f0ef101bc957231",
        //                 "organizationName": "Shihab International",
        //             },
        //             {
        //                 "email": "admin@gmail.com",
        //                 "name": "Shajibul Alam Shihab",
        //                 "phone": "01643433981",
        //                 "password": "1231231232",
        //                 "organizationId": "64cbbd756f0ef101bc957231",
        //                 "organizationName": "Shihab International"
        //             }
        //         ]
        //     },
        //     "batch": {
        //         "courseId": "651eae9d89151f9fa5fda8a7",
        //             "batchName": "Batch 2",
        //                 "batchStartDate": "2023-10-07",
        //                     "batchEndDate": "2023-10-22",
        //                         "creator": {
        //             "name": "Admin",
        //                 "email": "admin@gmail.com"
        //         },
        //         "organization": {
        //             "organizationId": "64cbbd756f0ef101bc957231",
        //                 "organizationName": "Shihab International"
        //         },
        //         "participants": [
        //             {
        //                 "email": "user@gmail.com",
        //                 "name": "User"
        //             },
        //             {
        //                 "email": "admin@gmail.com",
        //                 "name": "Shajibul Alam Shihab"
        //             }
        //         ]
        //     }
        // }







        app.post('/batches/create', async (req, res) => {

            const data = req.body;
            const participants = data.user.participants;
            const batch = data.batch;

            const batchResult = await batchCollection.insertOne(batch);
            const batchId = "" + batchResult.insertedId;
            let participantsResult;

            if (participants.length > 0) {
                const courses = [
                    {
                        batchId: batchId,
                        batchName: batch?.batchName,
                        courseId: batch?.courseId,
                        completedTask: 0
                    }
                ];

                const participantsWithCourses = participants.map(participant => ({
                    ...participant,
                    courses: courses
                }));


                participantsResult = await userCollection.insertMany(participantsWithCourses);
            }
            else {
                participantsResult = { message: "No Participant" }
            }

            const courseId = batch?.courseId;

            const newSchedule = {
                batchId,
                batch: batch?.batchName,
                weekEndDate: "",
                weekStartDate: ""
            }

            const weeksWithCourseId = await weekCollection.find({ courseId: courseId }).toArray();

            // Update each week to push the new schedule into the schedules array
            const updatePromises = weeksWithCourseId.map(async (week) => {
                if (!week.schedules) {
                    week.schedules = [];
                    week.schedules.push({
                        batchId,
                        batch: batch?.batchName,
                        weekEndDate: week?.weekStartDate ? week?.weekStartDate : "",
                        weekStartDate: week?.weekEndDate ? week?.weekEndDate : ""
                    });
                }
                else
                    week.schedules.push(newSchedule);

                // Update the week in the database
                const updateResult = await weekCollection.updateOne(
                    { _id: new ObjectId(week._id) },
                    { $set: { schedules: week.schedules } }
                );

                return updateResult;
            });

            // Execute all update operations in parallel
            const weekResult = await Promise.all(updatePromises);


            const chapters = await chapterCollection.find({ courseId: courseId }).toArray();

            // Update each chapter
            const chapterPromises = chapters.map(async (chapter) => {

                if (!chapter.tasks) {
                    return;
                }

                const nonAssignmentOrClassesTasks = chapter.tasks.filter(
                    (task) => task.taskType !== 'Assignment' && task.taskType !== 'Classes'
                );

                if (nonAssignmentOrClassesTasks.length > 0) {
                    // Initialize the "batches" array inside each non-Assignment and non-Classes task
                    nonAssignmentOrClassesTasks.forEach((task) => {
                        if (!task.batches) {
                            task.batches = [];
                        }

                        // Push a new batch object into the "batches" array
                        const newBatch = {
                            batchId: batchId, // Replace with your batchId
                            batchName: batch?.batchName, // Replace with your batchName
                        };

                        task.batches.push(newBatch);
                    });
                }

                // Update the chapter in the database
                const updateResult = await chapterCollection.updateOne(
                    { _id: new ObjectId(chapter._id) },
                    { $set: { tasks: chapter.tasks } }
                );

                return updateResult;
            });

            // Execute all update operations in parallel
            const chapterResult = await Promise.all(chapterPromises);

            res.send({
                "participant": participantsResult,
                "batch": batchResult,
                "week": weekResult,
                "chapter": chapterResult
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
            console.log(id);
            const query = { weekId: id };
            const chapters = await chapterCollection.find(query).toArray();
            res.send(chapters);
        });

        //get chapter
        app.get('/chapter/:id', async (req, res) => {
            const id = req.params.id;
            // console.log(id);
            const query = { _id: new ObjectId(id) };
            const chapter = await chapterCollection.findOne(query);
            res.send(chapter);
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
                organization: organization,
                weekStartDate: data.weekStartDate,
                weekEndDate: data.weekEndDate
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

        app.get('/week/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const week = await weekCollection.findOne(query);
            res.send(week);
        });

        //Rename weeks
        app.put('/weeks/:id', async (req, res) => {
            const id = req.params.id;
            const updatedData = req.body;
            // const weekStartDate = req.body.weekStartDate;
            // const weekEndDate = req.body.weekEndDate;

            const filter = { _id: new ObjectId(id) };

            const options = { upsert: true };
            const updatedDoc = {
                $set: updatedData
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


        //tasks
        app.post('/tasks/:id', async (req, res) => {
            const chapterId = req.body.chapterId;
            const courseId = req.body.courseId;
            const taskType = req.params.id;
            const task = req.body;
            const batches = task.batches;
            const taskName = task.taskName;
            let taskTypeInput;
            let result;

            switch (taskType) {
                case 'assignments':
                    taskTypeInput = "Assignment";
                    result = await assignmentCollection.insertOne(task);
                    break;
                case 'classes':
                    taskTypeInput = "Classes";
                    result = await classCollection.insertOne(task);
                    break;
                case 'readings':
                    taskTypeInput = "Reading";
                    result = await readingCollection.insertOne(task);
                    break;
                case 'quizes':
                    taskTypeInput = "Quiz";
                    result = await quizCollection.insertOne(task);
                    break;
                case 'liveTests':
                    taskTypeInput = "Live Test";
                    result = await liveTestCollection.insertOne(task);
                    break;
                case 'videos':
                    taskTypeInput = "Video";
                    result = await videoCollection.insertOne(task);
                    break;
                case 'audios':
                    taskTypeInput = "Audio";
                    result = await audioCollection.insertOne(task);
                    break;
                case 'files':
                    taskTypeInput = "Files";
                    result = await fileCollection.insertOne(task);
                    break;
                default:
                    return res.status(400).json({ error: 'Invalid task type' });
            }

            // res.status(200).json(result);

            const filter = { _id: new ObjectId(chapterId) };
            const options = { upsert: true };

            const newTask = {
                taskId: "" + result?.insertedId,
                taskType: taskTypeInput,
                taskName,
                batches: batches,
                contentStage: task?.contentStage
            };

            const updatedDoc = {
                $push: {
                    tasks: newTask
                }
            };

            const newResult = await chapterCollection.updateOne(filter, updatedDoc, options);

            if (newResult.modifiedCount > 0) {
                const filter = { _id: new ObjectId(courseId) };
                const options = { upsert: true };

                const updateCourse = {
                    $inc: { totalTask: 1 } // Increment totalTask by 1
                };

                const updateResult = await courseCollection.updateOne(filter, updateCourse, options);

                // Check if the update was successful, and if totalTask field didn't exist, it will be created
                if (updateResult.modifiedCount > 0 || updateResult.upsertedCount > 0) {
                    res.status(200).json({ result, newResult, updateResult });
                } else {
                    res.status(500).json({ message: 'Failed to update course totalTask' });
                }
            } else {
                res.status(500).json({ message: 'Failed to update chapter tasks' });
            }

        });


        //get tasks by id
        app.get('/tasks/:taskType', async (req, res) => {
            const taskType = req.params.taskType;
            const id = req.query.id;
            const filter = { _id: new ObjectId(id) };
            let result;

            switch (taskType) {
                case 'assignments':
                    result = await assignmentCollection.findOne(filter);
                    break;
                case 'classes':
                    result = await classCollection.findOne(filter);
                    break;
                case 'readings':
                    result = await readingCollection.findOne(filter);
                    break;
                case 'quizes':
                    result = await quizCollection.findOne(filter);
                    break;
                case 'liveTests':
                    result = await liveTestCollection.findOne(filter);
                    break;
                case 'videos':
                    result = await videoCollection.findOne(filter);
                    break;
                case 'audios':
                    result = await audioCollection.findOne(filter);
                    break;
                case 'files':
                    result = await fileCollection.findOne(filter);
                    break;
                default:
                    return res.status(400).json({ error: 'Invalid task type' });
            }

            res.status(200).json(result);
        });


        app.delete('/tasks/:taskType/:id', async (req, res) => {
            const taskType = req.params.taskType;
            const taskId = req.params.id;

            let deleteResult, result;

            switch (taskType) {
                case 'assignments':
                    deleteResult = await assignmentCollection.deleteOne({ _id: new ObjectId(taskId) });
                    break;
                case 'classes':
                    deleteResult = await classCollection.deleteOne({ _id: new ObjectId(taskId) });
                    break;
                case 'readings':
                    deleteResult = await readingCollection.deleteOne({ _id: new ObjectId(taskId) });
                    break;
                case 'quizes':
                    deleteResult = await quizCollection.deleteOne({ _id: new ObjectId(taskId) });
                    break;
                case 'liveTests':
                    deleteResult = await liveTestCollection.deleteOne({ _id: new ObjectId(taskId) });
                    break;
                case 'videos':
                    deleteResult = await videoCollection.deleteOne({ _id: new ObjectId(taskId) });
                    break;
                case 'audios':
                    deleteResult = await audioCollection.deleteOne({ _id: new ObjectId(taskId) });
                    break;
                case 'files':
                    deleteResult = await fileCollection.deleteOne({ _id: new ObjectId(taskId) });
                    break;
                default:
                    return res.status(400).json({ error: 'Invalid task type' });
            }

            // Remove task from chapter's tasks array
            if (deleteResult.deletedCount > 0) {
                const chapterFilter = { 'tasks.taskId': taskId };
                const chapterUpdate = {
                    $pull: { tasks: { taskId } }
                };
                result = await chapterCollection.updateOne(chapterFilter, chapterUpdate);
            }

            res.status(200).json({ deleteResult, result });
        });


        app.put('/tasks/:taskType/:id', async (req, res) => {
            const taskType = req.params.taskType;
            const taskId = req.params.id;
            const updatedTask = req.body;

            let updateResult, result;

            switch (taskType) {
                case 'assignments':
                    updateResult = await assignmentCollection.updateOne(
                        { _id: new ObjectId(taskId) },
                        { $set: updatedTask }
                    );
                    break;
                case 'classes':
                    updateResult = await classCollection.updateOne(
                        { _id: new ObjectId(taskId) },
                        { $set: updatedTask }
                    );
                    break;
                case 'readings':
                    updateResult = await readingCollection.updateOne(
                        { _id: new ObjectId(taskId) },
                        { $set: updatedTask }
                    );
                    break;
                case 'quizes':
                    updateResult = await quizCollection.updateOne(
                        { _id: new ObjectId(taskId) },
                        { $set: updatedTask }
                    );
                    break;
                case 'liveTests':
                    updateResult = await liveTestCollection.updateOne(
                        { _id: new ObjectId(taskId) },
                        { $set: updatedTask }
                    );
                    break;
                case 'videos':
                    updateResult = await videoCollection.updateOne(
                        { _id: new ObjectId(taskId) },
                        { $set: updatedTask }
                    );
                    break;
                case 'audios':
                    updateResult = await audioCollection.updateOne(
                        { _id: new ObjectId(taskId) },
                        { $set: updatedTask }
                    );
                    break;
                case 'files':
                    updateResult = await fileCollection.updateOne(
                        { _id: new ObjectId(taskId) },
                        { $set: updatedTask }
                    );
                    break;
                default:
                    return res.status(400).json({ error: 'Invalid task type' });
            }

            console.log(updateResult.modifiedCount);

            // Update chapter's task info as well
            if (updateResult.modifiedCount > 0) {
                const chapterFilter = { 'tasks.taskId': taskId };
                const find = await chapterCollection.findOne(chapterFilter);
                console.log(find);
                const chapterUpdate = {
                    $set: { 
                        'tasks.$.taskName': updatedTask.taskName, 'tasks.$.batches': updatedTask.batches, 
                        'tasks.$.contentStage': updatedTask.contentStage 
                    }
                };
                result = await chapterCollection.updateOne(chapterFilter, chapterUpdate);
            }

            res.status(200).json({ updateResult, result });
        });


        app.get('/chapters/courseId/:courseId', async (req, res) => {

            const courseId = req.params.courseId;
            const filter = { courseId: courseId };
            const result = await chapterCollection.find(filter).toArray();
            res.send(result);

        });


        app.get('/assignments/chapterId/:chapterId', async (req, res) => {

            const chapterId = req.params.chapterId;
            const filter = { chapterId: chapterId };
            const result = await assignmentCollection.find(filter).toArray();
            res.send(result);

        });


        app.get('/allTask/:id', async (req, res) => {

            const id = req.query.id;
            const filter = { chapterId: id };
            let allData = {};


            const result1 = await assignmentCollection.find(filter).toArray();
            allData = {
                ...allData,
                assignment: {
                    data: result1,
                    length: result1.length
                }
            }
            const result2 = await classCollection.find(filter).toArray();
            allData = {
                ...allData,
                classes: {
                    data: result2,
                    length: result2.length
                }
            };

            const result3 = await readingCollection.find(filter).toArray();
            allData = {
                ...allData,
                reading: {
                    data: result3,
                    length: result3.length
                }
            };

            const result4 = await quizCollection.find(filter).toArray();
            allData = {
                ...allData,
                quiz: {
                    data: result4,
                    length: result4.length
                }
            };

            const result5 = await liveTestCollection.find(filter).toArray();
            allData = {
                ...allData,
                liveTest: {
                    data: result5,
                    length: result5.length
                }
            };

            const result6 = await videoCollection.find(filter).toArray();
            allData = {
                ...allData,
                video: {
                    data: result6,
                    length: result6.length
                }
            };

            const result7 = await audioCollection.find(filter).toArray();
            allData = {
                ...allData,
                audio: {
                    data: result7,
                    length: result7.length
                }
            };

            const result8 = await fileCollection.find(filter).toArray();
            allData = {
                ...allData,
                files: {
                    data: result8,
                    length: result8.length
                }
            };



            res.status(200).json(allData);
        });


        app.get('/assignments', async (req, res) => {
            const result = await assignmentCollection.find({}).toArray();
            res.send(result);
        });


        // Add a new question to the questions array in the quiz collection
        app.post('/quizzes/:quizId/questions', async (req, res) => {
            const quizId = req.params.quizId;
            const newQuestion = req.body;

            let questionId;
            let isUniqueId = false;

            while (!isUniqueId) {
                // Generate a unique question ID
                questionId = new ObjectId().toString();

                // Check if the generated questionId is unique in the questions array
                const quiz = await quizCollection.findOne({ _id: new ObjectId(quizId) });
                const questionIds = quiz.questions.map(question => question.questionId);

                if (!questionIds.includes(questionId)) {
                    isUniqueId = true;
                }
            }

            // Add the generated question ID to the new question object
            newQuestion.questionId = questionId;

            const updateResult = await quizCollection.updateOne(
                { _id: new ObjectId(quizId) },
                { $push: { questions: newQuestion } }
            );

            if (updateResult.modifiedCount > 0) {
                res.status(200).json({ success: true, questionId, updateResult });
            } else {
                res.status(400).json({ success: false, message: 'Failed to add question' });
            }
        });


        // Update a question within the questions array in the quiz collection
        app.put('/quizzes/:quizId/questions/:questionId', async (req, res) => {
            const quizId = req.params.quizId;
            const questionId = req.params.questionId;
            const updatedQuestion = req.body;

            const updateResult = await quizCollection.updateOne(
                { _id: new ObjectId(quizId), 'questions.questionId': questionId },
                { $set: { 'questions.$': updatedQuestion } }
            );

            if (updateResult.modifiedCount > 0) {
                res.status(200).json({ success: true, updateResult });
            } else {
                res.status(400).json({ success: false, message: 'Failed to update question' });
            }
        });



        // Get a specific question from the questions array in the quiz collection
        app.get('/quizzes/:quizId/questions/:questionId', async (req, res) => {
            const quizId = req.params.quizId;
            const questionId = req.params.questionId;

            const quiz = await quizCollection.findOne(
                { _id: new ObjectId(quizId), 'questions.questionId': questionId },
                { projection: { questions: { $elemMatch: { questionId: questionId } } } }
            );

            if (quiz && quiz.questions && quiz.questions.length > 0) {
                const question = quiz.questions[0];
                res.status(200).json(question);
            } else {
                res.status(404).json({ message: 'Question not found' });
            }
        });




        //Create Skill category
        app.post('/skill_categories', async (req, res) => {
            // Check if the organizationId exists in the database
            const { organizationId, categoryName, courseId } = req.body;
            const existingData = await skillCategoryCollection.findOne({ organizationId });

            if (existingData) {
                // If the organizationId exists, find the corresponding course
                const existingCourse = existingData.courses.find(
                    (course) => course.courseId === courseId
                );

                if (existingCourse) {
                    // If the courseId exists, check if the categoryName exists in categories
                    const existingCategory = existingCourse.categories.find(
                        (category) => category.categoryName.toLowerCase() === categoryName.toLowerCase()
                    );

                    if (!existingCategory) {
                        // If the categoryName doesn't exist, add it to the categories array
                        const result1 = await skillCategoryCollection.updateOne(
                            {
                                organizationId,
                                "courses.courseId": courseId,
                            },
                            {
                                $push: {
                                    "courses.$.categories": {
                                        categoryName,
                                    },
                                },
                            }
                        );

                        res.send(result1);
                    }
                }
                else {
                    // If the courseId doesn't exist, create a new course object and add it to the courses array
                    const result2 = await skillCategoryCollection.updateOne(
                        {
                            organizationId,
                        },
                        {
                            $push: {
                                courses: {
                                    courseId,
                                    categories: [
                                        {
                                            categoryName,
                                        },
                                    ],
                                },
                            },
                        }
                    );

                    res.send(result2)
                }
            } else {
                // If the organizationId doesn't exist, create a new document
                const result3 = await skillCategoryCollection.insertOne({
                    organizationId,
                    courses: [
                        {
                            courseId,
                            categories: [
                                {
                                    categoryName,
                                },
                            ],
                        },
                    ],
                });

                res.send(result3)
            }
        });


        //get a skill category
        app.get('/skill_categories/:id', async (req, res) => {
            const organizationId = req.params.id;
            const filter = { organizationId: organizationId };
            const result = await skillCategoryCollection.findOne(filter);
            res.send(result);
        });

        //get all skill category
        app.get('/skill_categories', async (req, res) => {
            const filter = {};
            const result = await skillCategoryCollection.find(filter).toArray();
            res.send(result);
        });


        //delete a skill category
        app.delete('/skill_categories/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const result = await skillCategoryCollection.deleteOne(filter);
            res.send(result);
        });



        //Create category
        app.post('/skills', async (req, res) => {
            const { organizationId, categoryName, courseId } = req.body;
            const skillData = req.body.skill;

            // Find the organization
            const organization = await skillCategoryCollection.findOne({ organizationId });
            if (!organization) {
                res.status(404).json({ error: "Organization not found" });
                return;
            }

            // Find the course and category
            const course = organization.courses.find((c) => c.courseId === courseId);
            if (!course) {
                res.status(404).json({ error: "Course not found" });
                return;
            }

            const category = course.categories.find(
                (cat) => cat.categoryName.toLowerCase() === categoryName.toLowerCase()
            );

            if (category) {
                if (!category.skills) {
                    // If skills array doesn't exist, create it
                    category.skills = [];
                }

                // Find the skill if it exists
                const existingSkillIndex = category.skills.findIndex(
                    (skill) => skill.skillName === skillData.skillName
                );

                if (existingSkillIndex !== -1) {
                    // If skill exists, update parameters
                    const existingSkill = category.skills[existingSkillIndex];

                    skillData.parameters.forEach((param) => {
                        if (!existingSkill.parameters.includes(param)) {
                            existingSkill.parameters.push(param);
                        }
                    });
                } else {
                    // If skill doesn't exist, create it with parameters
                    category.skills.push({
                        skillName: skillData.skillName,
                        parameters: skillData.parameters,
                    });
                }
            } else {
                // If category doesn't exist, create it with skill
                course.categories.push({
                    categoryName,
                    skills: [
                        {
                            skillName: skillData.skillName,
                            parameters: skillData.parameters,
                        },
                    ],
                });
            }

            // Update the organization in the database
            const result = await skillCategoryCollection.updateOne(
                { organizationId },
                { $set: { courses: organization.courses } }
            );

            res.send(result)

        });


        //update a categoryName
        app.put("/skill_categories/updateCategoryName", async (req, res) => {
            const { organizationId, courseId, oldCategoryName, newCategoryName } = req.body;

            // Find the organization
            const organization = await skillCategoryCollection.findOne({ organizationId });
            if (!organization) {
                res.status(404).json({ error: "Organization not found" });
                return;
            }

            // Find the course
            const course = organization.courses.find((c) => c.courseId === courseId);
            if (!course) {
                res.status(404).json({ error: "Course not found" });
                return;
            }

            const categoryExists = course.categories.some(
                (cat) => cat.categoryName.toLowerCase() === newCategoryName.toLowerCase()
            );

            if (categoryExists) {
                res.status(400).json({ error: "Category already exists. Please choose another name." });
                return;
            }

            // Find the category
            const category = course.categories.find(
                (cat) => cat.categoryName.toLowerCase() === oldCategoryName.toLowerCase()
            );

            if (!category) {
                res.status(404).json({ error: "Category not found" });
                return;
            }

            // Update the category name
            category.categoryName = newCategoryName;

            // Update the organization in the database
            await skillCategoryCollection.updateOne(
                { organizationId },
                { $set: { courses: organization.courses } }
            );

            res.status(200).json({ message: "Category name updated successfully!" });

        });


        //Delete a category
        app.put("/deleteCategory", async (req, res) => {
            // res.send(req.body);
            // console.log(req.body);
            const { organizationId, courseId, categoryName } = req.body;
            console.log(organizationId);
            console.log(courseId);
            console.log(categoryName);
            // res.send(req.body);

            // Find the organization
            const organization = await skillCategoryCollection.findOne({ organizationId });
            if (!organization) {
                res.status(404).json({ error: "Organization not found" });
                return;
            }

            // Find the course
            const course = organization.courses.find((c) => c.courseId === courseId);
            if (!course) {
                res.status(404).json({ error: "Course not found" });
                return;
            }

            // Find the category index
            const categoryIndex = course.categories.findIndex(
                (cat) => cat.categoryName.toLowerCase() === categoryName.toLowerCase()
            );

            console.log(categoryIndex);

            if (categoryIndex === -1) {
                res.status(404).json({ error: "Category not found" });
                return;
            }


            // Remove the category
            course.categories.splice(categoryIndex, 1);


            // Update the organization in the database
            const result = await skillCategoryCollection.updateOne(
                { organizationId },
                { $set: { courses: organization.courses } }
            );

            res.send(result);

        });


        app.post("/skillCategoriesByCourseId", async (req, res) => {
            const { organizationId, courseId } = req.body;

            // console.log(req.body);
            // Find the document with matching organizationId and courseId
            const filter = {
                organizationId: organizationId,
                "courses.courseId": courseId,
            };

            const document = await skillCategoryCollection.findOne(filter);

            console.log(filter);
            console.log(document);

            if (!document) {
                res.status(404).json({ error: "Document not found" });
                return;
            }

            // Extract and return the categories for the specified courseId
            const categories = document.courses.find(
                (course) => course.courseId === courseId
            ).categories;

            res.status(200).json(categories);

        });


        app.delete("/deleteSkill", async (req, res) => {
            const { organizationId, courseId, categoryName, skillName } = req.body;


            // Find the document to update
            const document = await skillCategoryCollection.findOne({
                organizationId,
                "courses.courseId": courseId,
                "courses.categories.categoryName": categoryName,
            });

            if (!document) {
                res.status(404).json({ error: "Document not found" });
                return;
            }

            // Update the document by removing the skill
            document.courses.forEach((course) => {
                course.categories.forEach((category) => {
                    if (category.categoryName === categoryName) {
                        category.skills = category.skills.filter(
                            (skill) => skill.skillName !== skillName
                        );
                    }
                });
            });

            // Save the updated document back to the collection
            const result = await skillCategoryCollection.replaceOne(
                { organizationId },
                document
            );

            res.send(result);

        });



        app.put("/editSkill", async (req, res) => {
            const {
                organizationId,
                courseId,
                categoryName,
                oldSkillName,
                skill,
            } = req.body;

            // Find the document to update
            const document = await skillCategoryCollection.findOne({
                organizationId,
                "courses.courseId": courseId,
                "courses.categories.categoryName": categoryName,
            });

            if (!document) {
                res.status(404).json({ error: "Document not found" });
                return;
            }

            // Update the skill details within the category
            document.courses.forEach((course) => {
                course.categories.forEach((category) => {
                    if (category.categoryName === categoryName) {
                        category.skills = category.skills.map((existingSkill) => {
                            if (existingSkill.skillName === oldSkillName) {
                                return {
                                    skillName: skill.skillName,
                                    parameters: skill.parameters,
                                    description: skill.description,
                                };
                            }
                            return existingSkill;
                        });
                    }
                });
            });

            // Save the updated document back to the collection
            const result = await skillCategoryCollection.replaceOne(
                { organizationId },
                document
            );

            res.send(result)
        });


        //Create earning category
        app.post('/earning_categories', async (req, res) => {
            // Check if the organizationId exists in the database
            const { organizationId, categoryName, courseId } = req.body;
            const existingData = await earningCategoryCollection.findOne({ organizationId });

            if (existingData) {
                // If the organizationId exists, find the corresponding course
                const existingCourse = existingData.courses.find(
                    (course) => course.courseId === courseId
                );

                if (existingCourse) {
                    // If the courseId exists, check if the categoryName exists in categories
                    const existingCategory = existingCourse.categories.find(
                        (category) => category.categoryName.toLowerCase() === categoryName.toLowerCase()
                    );

                    if (!existingCategory) {
                        // If the categoryName doesn't exist, add it to the categories array
                        const result1 = await earningCategoryCollection.updateOne(
                            {
                                organizationId,
                                "courses.courseId": courseId,
                            },
                            {
                                $push: {
                                    "courses.$.categories": {
                                        categoryName,
                                    },
                                },
                            }
                        );

                        res.send(result1);
                    }
                }
                else {
                    // If the courseId doesn't exist, create a new course object and add it to the courses array
                    const result2 = await earningCategoryCollection.updateOne(
                        {
                            organizationId,
                        },
                        {
                            $push: {
                                courses: {
                                    courseId,
                                    categories: [
                                        {
                                            categoryName,
                                        },
                                    ],
                                },
                            },
                        }
                    );

                    res.send(result2)
                }
            } else {
                // If the organizationId doesn't exist, create a new document
                const result3 = await earningCategoryCollection.insertOne({
                    organizationId,
                    courses: [
                        {
                            courseId,
                            categories: [
                                {
                                    categoryName,
                                },
                            ],
                        },
                    ],
                });

                res.send(result3)
            }
        });

        app.get('/earning_categories', async (req, res) => {
            const filter = {};
            const result = await earningCategoryCollection.find(filter).toArray();
            res.send(result);
        });


        app.get('/earning_categories/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { organizationId: id };
            const result = await earningCategoryCollection.findOne(filter);
            res.send(result);
        });


        app.post('/earningPointItems', async (req, res) => {
            const { organizationId, courseId, categoryName, earningItem } = req.body;

            const document = await earningCategoryCollection.findOne({
                organizationId,
                "courses.courseId": courseId,
                "courses.categories.categoryName": categoryName,
            });

            if (!document) {
                res.status(404).json({ error: "Document not found" });
                return;
            }

            console.log(document);

            const matchingCourse = document.courses.find(
                (course) => course.courseId === courseId
            );

            // Find the category with matching categoryName
            const matchingCategory = matchingCourse.categories.find(
                (category) => category.categoryName === categoryName
            );

            if (!matchingCategory) {
                res.status(404).json({ error: "Category not found" });
                return;
            }

            // Initialize the earningItems array if it doesn't exist
            if (!matchingCategory.earningItems) {
                matchingCategory.earningItems = [];
            }

            // Check if the earning item name already exists
            const existingEarningItem = matchingCategory.earningItems.find(
                (item) => item.earningItemName === earningItem.earningItemName
            );

            if (existingEarningItem) {
                res.status(400).json({ error: "Earning item name already exists. Please provide another name." });
                return;
            }

            // Add the new earning item to the array
            matchingCategory.earningItems.push(earningItem);

            // Save the updated document back to the collection
            const result = await earningCategoryCollection.replaceOne(
                { organizationId },
                document
            );

            res.send(result);

        });


        //update a earning categoryName
        app.put("/earning_categories/categoryName", async (req, res) => {
            const { organizationId, courseId, oldCategoryName, newCategoryName } = req.body;

            // Find the organization
            const organization = await earningCategoryCollection.findOne({ organizationId });
            if (!organization) {
                res.status(404).json({ error: "Organization not found" });
                return;
            }

            // Find the course
            const course = organization.courses.find((c) => c.courseId === courseId);
            if (!course) {
                res.status(404).json({ error: "Course not found" });
                return;
            }

            const categoryExists = course.categories.some(
                (cat) => cat.categoryName.toLowerCase() === newCategoryName.toLowerCase()
            );

            if (categoryExists) {
                res.status(400).json({ error: "Category already exists. Please choose another name." });
                return;
            }

            // Find the category
            const category = course.categories.find(
                (cat) => cat.categoryName.toLowerCase() === oldCategoryName.toLowerCase()
            );

            if (!category) {
                res.status(404).json({ error: "Category not found" });
                return;
            }

            // Update the category name
            category.categoryName = newCategoryName;

            // Update the organization in the database
            const result = await earningCategoryCollection.updateOne(
                { organizationId },
                { $set: { courses: organization.courses } }
            );

            res.send(result);

        });


        //Delete a earning category
        app.put("/earning/deleteCategory", async (req, res) => {
            // res.send(req.body);
            // console.log(req.body);
            const { organizationId, courseId, categoryName } = req.body;
            // console.log(organizationId);
            // console.log(courseId);
            // console.log(categoryName);
            // res.send(req.body);

            // Find the organization
            const organization = await earningCategoryCollection.findOne({ organizationId });
            if (!organization) {
                res.status(404).json({ error: "Organization not found" });
                return;
            }

            // Find the course
            const course = organization.courses.find((c) => c.courseId === courseId);
            if (!course) {
                res.status(404).json({ error: "Course not found" });
                return;
            }

            // Find the category index
            const categoryIndex = course.categories.findIndex(
                (cat) => cat.categoryName.toLowerCase() === categoryName.toLowerCase()
            );

            console.log(categoryIndex);

            if (categoryIndex === -1) {
                res.status(404).json({ error: "Category not found" });
                return;
            }


            // Remove the category
            course.categories.splice(categoryIndex, 1);


            // Update the organization in the database
            const result = await earningCategoryCollection.updateOne(
                { organizationId },
                { $set: { courses: organization.courses } }
            );

            res.send(result);

        });

        //delete item
        app.delete("/deleteItem", async (req, res) => {
            const { organizationId, courseId, categoryName, earningItemName } = req.body;


            // Find the document to update
            const document = await earningCategoryCollection.findOne({
                organizationId,
                "courses.courseId": courseId,
                "courses.categories.categoryName": categoryName,
            });

            if (!document) {
                res.status(404).json({ error: "Document not found" });
                return;
            }

            // Update the document by removing the skill
            document.courses.forEach((course) => {
                course.categories.forEach((category) => {
                    if (category.categoryName === categoryName) {
                        category.earningItems = category.earningItems.filter(
                            (skill) => skill.earningItemName !== earningItemName
                        );
                    }
                });
            });

            // Save the updated document back to the collection
            const result = await earningCategoryCollection.replaceOne(
                { organizationId },
                document
            );

            res.send(result);

        });


        //edit skill
        app.put("/editItem", async (req, res) => {
            const {
                organizationId,
                courseId,
                categoryName,
                oldItemName,
                item,
            } = req.body;

            // Find the document to update
            const document = await earningCategoryCollection.findOne({
                organizationId,
                "courses.courseId": courseId,
                "courses.categories.categoryName": categoryName,
            });

            if (!document) {
                res.status(404).json({ error: "Document not found" });
                return;
            }

            // Update the skill details within the category
            document.courses.forEach((course) => {
                course.categories.forEach((category) => {
                    if (category.categoryName === categoryName) {
                        category.earningItems = category.earningItems.map((existingItem) => {
                            if (existingItem.earningItemName === oldItemName) {
                                return {
                                    earningItemName: item.earningItemName,
                                    itemEarningValue: item.itemEarningValue,
                                    itemValue: item.itemValue,
                                };
                            }
                            return existingItem;
                        });
                    }
                });
            });

            // Save the updated document back to the collection
            const result = await earningCategoryCollection.replaceOne(
                { organizationId },
                document
            );

            res.send(result)
        });


        app.post("/itemCategoryByCourseId", async (req, res) => {
            const { organizationId, courseId } = req.body;

            // console.log(req.body);
            // Find the document with matching organizationId and courseId
            const filter = {
                organizationId: organizationId,
                "courses.courseId": courseId,
            };

            const document = await earningCategoryCollection.findOne(filter);

            console.log(filter);
            console.log(document);

            if (!document) {
                res.status(404).json({ error: "Document not found" });
                return;
            }

            // Extract and return the categories for the specified courseId
            const categories = document.courses.find(
                (course) => course.courseId === courseId
            ).categories;

            res.status(200).json(categories);

        });


        app.post("/submitAssignment", async (req, res) => {
            const newSubmission = req.body;


            const query = {
                'taskId': newSubmission.taskId,
                'submitter._id': newSubmission.submitter._id
            };

            // Try to find an existing submission with the same taskId and submitter _id
            const existingSubmission = await assignmentSubmitCollection.findOne(query);

            if (existingSubmission) {
                // Update the existing submission
                const updateResult = await assignmentSubmitCollection.updateOne(query, { $set: newSubmission });
                res.send(updateResult);

            } else {
                // Insert a new submission
                const insertResult = await assignmentSubmitCollection.insertOne(newSubmission);
                res.status(200).json(insertResult);
            }

        });


        // Find assignment submission by taskId and submitter _id
        app.get('/submitAssignment/:taskId/:submitterId', async (req, res) => {
            const taskId = req.params.taskId;
            const submitterId = req.params.submitterId;

            const query = {
                taskId: taskId,
                'submitter._id': submitterId
            };

            try {
                const submissions = await assignmentSubmitCollection.find(query).toArray();

                if (submissions.length === 0) {
                    return res.status(404).json({ message: 'No assignment submissions found' });
                }

                res.status(200).json(submissions);
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });

        // Find assignment submission by taskId and submitter _id
        app.get('/getSingleSubmitAssignment/:id', async (req, res) => {
            const id = req.params.id;

            const query = { _id: new ObjectId(id) };

            try {
                const submissions = await assignmentSubmitCollection.findOne(query);

                if (submissions.length === 0) {
                    return res.status(404).json({ message: 'No assignment submissions found' });
                }

                res.status(200).send(submissions);
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });


        // Find assignment submission by organization
        app.get('/getSubmitAssignment/:organizationId', async (req, res) => {
            const organizationId = req.params.organizationId;
            console.log(organizationId);
            const query = {
                'submitter.organizationId': organizationId
            };

            try {
                const submissions = await assignmentSubmitCollection.find(query).toArray();

                if (submissions.length === 0) {
                    return res.status(404).json({ message: 'No assignment submissions found for this organization' });
                }

                res.status(200).send(submissions);
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });

        // Find assignment submission by organization
        app.get('/getSubmitAssignment/submitter/:submitterId/:taskId', async (req, res) => {
            const submitterId = req.params.submitterId;
            const taskId = req.params.taskId;
            const query = {
                'taskId': taskId,
                'submitter._id': submitterId
            };

            try {
                const submissions = await assignmentSubmitCollection.findOne(query);
                res.status(200).send(submissions);
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });


        app.post('/submitAssignment/:submissionId/addResult', async (req, res) => {
            const submissionId = req.params.submissionId;
            const result = req.body;
            try {
                // Find the assignment submission by its _id
                const submission = await assignmentSubmitCollection.findOne({ _id: new ObjectId(submissionId) });

                if (!submission) {
                    return res.status(404).json({ message: 'Assignment submission not found' });
                }

                // Add the result object to the submitter object
                submission.submitter.result = result;

                // Update the document in the collection
                const updateResult = await assignmentSubmitCollection.updateOne(
                    { _id: new ObjectId(submissionId) },
                    { $set: { submitter: submission.submitter } }
                );

                if (updateResult.modifiedCount > 0) {
                    res.status(200).json(updateResult);
                } else {
                    res.status(500).json({ success: false, message: 'Failed to add result to assignment submission' });
                }
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });


        app.post('/submitAssignment/:submissionId/addReview', async (req, res) => {
            const submissionId = req.params.submissionId;
            const review = req.body;
            try {
                // Find the assignment submission by its _id
                const submission = await assignmentSubmitCollection.findOne({ _id: new ObjectId(submissionId) });

                if (!submission) {
                    return res.status(404).json({ message: 'Assignment submission not found' });
                }

                // Add the result object to the submitter object
                submission.submitter.result.review = review;

                // Update the document in the collection
                const updateResult = await assignmentSubmitCollection.updateOne(
                    { _id: new ObjectId(submissionId) },
                    { $set: { 'submitter.result': submission.submitter.result } }
                );

                if (updateResult.modifiedCount > 0) {
                    res.status(200).json(updateResult);
                } else {
                    res.status(500).json({ success: false, message: 'Failed to add result to assignment submission' });
                }
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });


        // Find assignment submission by organization
        app.get('/getSubmitAssignment/all/:submitterId', async (req, res) => {
            const submitterId = req.params.submitterId;
            const query = {
                'submitter._id': submitterId
            };

            try {
                const submissions = await assignmentSubmitCollection.find(query).toArray();
                res.status(200).send(submissions);
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });



        //events

        app.post('/events', async (req, res) => {
            const event = req.body;
            const result = await eventCollection.insertOne(event);
            res.send(result);
        });


        app.get('/events', async (req, res) => {
            const filter = {};
            const result = await eventCollection.find(filter).toArray();
            res.send(result);
        });

        app.get('/event/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const result = await eventCollection.findOne(filter);
            res.send(result);
        });


        // Add attendees to a class
        app.post('/classes/:classId/add-attendees', async (req, res) => {
            // console.log("Api called");
            const classId = req.params.classId;
            const attendee = req.body.attendee;

            console.log(classId);
            console.log(attendee);

            // Find the class by its _id
            const classDocument = await classCollection.findOne({ _id: new ObjectId(classId) });

            if (!classDocument) {
                return res.status(404).json({ message: 'Class not found' });
            }
            // Add attendees to the class
            if (!classDocument.attendees) {
                classDocument.attendees = [];
            }

            // Check if an attendee with the same email already exists in the class
            const duplicateAttendee = classDocument.attendees.find(newAttendee => attendee.email === newAttendee.email);

            if (duplicateAttendee) {
                return res.send({ message: 'Attendee with the same email already exists in the class' });
            }

            classDocument.attendees = [...classDocument.attendees, attendee];

            // Update the document in the collection
            const updateResult = await classCollection.updateOne(
                { _id: new ObjectId(classId) },
                { $set: { attendees: classDocument.attendees } }
            );

            if (updateResult.modifiedCount > 0) {
                res.status(200).json(updateResult);
            } else {
                res.status(500).json({ success: false, message: 'Failed to add attendees to the class' });
            }
        });



        app.post(
            "/chapter/:chapterId/task/:taskId/add-participant/:taskType",
            async (req, res) => {
                const chapterId = req.params.chapterId;
                const taskId = req.params.taskId;
                const participantChapter = req.body.participantChapter;
                const participantTask = req.body.participantTask;
                const courseId = req.body.courseId;
                const courseName = req.body.courseName;
                const taskType = req.params.taskType;

                try {
                    const chapterDocument = await chapterCollection.findOne({
                        _id: new ObjectId(chapterId),
                    });

                    if (!chapterDocument) {
                        return res.status(404).json({ message: "Chapter not found" });
                    }

                    const task = chapterDocument.tasks.find(
                        (task) => task.taskId === taskId && task.taskType === taskType
                    );

                    if (!task) {
                        return res
                            .status(404)
                            .json({ message: "Task not found within the chapter" });
                    }

                    if (!task.participants) {
                        task.participants = [];
                    }

                    // Check if the participant with the same ID already exists in the task
                    const existingParticipantChapterIndex = task.participants.findIndex(
                        (existing) => existing.email === participantChapter.email
                    );

                    if (existingParticipantChapterIndex !== -1) {
                        // Participant already exists, update their information
                        task.participants[existingParticipantChapterIndex] =
                            participantChapter;
                    } else {
                        // Participant is new, add them to the task
                        task.participants.push(participantChapter);
                    }

                    // Update the document in the chapter collection
                    await chapterCollection.updateOne(
                        { _id: new ObjectId(chapterId) },
                        { $set: { tasks: chapterDocument.tasks } }
                    );

                    // Find the task collection based on task type
                    let taskCollection;
                    switch (taskType) {
                        case "Reading":
                            taskCollection = readingCollection;
                            break;
                        case "Quiz":
                            taskCollection = quizCollection;
                            break;
                        case "Assignment":
                            taskCollection = assignmentCollection;
                            break;
                        case "Classes":
                            taskCollection = classCollection;
                            break;
                        case "LiveTests":
                            taskCollection = liveTestCollection;
                            break;
                        case "Video":
                            taskCollection = videoCollection;
                            break;
                        case "Audio":
                            taskCollection = audioCollection;
                            break;
                        case "Files":
                            taskCollection = fileCollection;
                            break;
                        default:
                            return res.status(400).json({ message: "Invalid task type" });
                    }

                    const taskDocument = await taskCollection.findOne({
                        _id: new ObjectId(taskId),
                    });

                    if (!taskDocument) {
                        return res
                            .status(404)
                            .json({ message: "Task not found within the task collection" });
                    }

                    if (!taskDocument.participants) {
                        taskDocument.participants = [];
                    }

                    // Check if the participant with the same ID already exists in the task collection
                    const existingParticipantTaskIndex =
                        taskDocument.participants.findIndex(
                            (existing) =>
                                existing.participant.email === participantTask.participant.email
                        );

                    if (existingParticipantTaskIndex !== -1) {
                        // Participant already exists, update their information
                        taskDocument.participants[existingParticipantTaskIndex] =
                            participantTask;
                    } else {
                        // Participant is new, add them to the task collection
                        taskDocument.participants.push(participantTask);
                    }

                    // Update the document in the task collection
                    const result = await taskCollection.updateOne(
                        { _id: new ObjectId(taskId) },
                        { $set: { participants: taskDocument.participants } }
                    );

                    if (result) {
                        // Search for the user in userCollection using their email
                        const user = await userCollection.findOne({ email: participantTask.participant.email });

                        if (user) {
                            // Check if the user already has a course entry with the same courseId
                            const existingCourseIndex = user.courses ? user.courses.findIndex(
                                (course) => course.courseId === courseId
                            ) : -1;

                            if (existingCourseIndex !== -1) {
                                // User has an existing course entry, update completedTask count
                                user.courses[existingCourseIndex].completedTask++;
                            } else {
                                // User doesn't have a course entry for this courseId, create a new one
                                const newCourseEntry = {
                                    courseId: courseId,
                                    courseName: courseName,
                                    completedTask: 1, // Initialize completedTask to 1 for the new course
                                };
                                if (!user.courses) {
                                    user.courses = []; // Initialize the courses array if it doesn't exist
                                }
                                user.courses.push(newCourseEntry);
                            }

                            // Update the user document in userCollection
                            await userCollection.updateOne(
                                { email: participantTask.participant.email },
                                { $set: { courses: user.courses } }
                            );
                        }

                        res.status(200).json(result);
                    }
                } catch (error) {
                    console.error(error);
                    res.status(500).json({ message: "Internal server error" });
                }
            }
        );











        /////////   sohan's code ////////////

        /// Create Redemption category

        app.post('/redemption_categories', async (req, res) => {
            // Check if the organizationId exists in the database
            const { organizationId, categoryName, courseId } = req.body;
            const existingData = await redemptionCategoryCollection.findOne({ organizationId });

            if (existingData) {
                // If the organizationId exists, find the corresponding course
                const existingCourse = existingData.courses.find(
                    (course) => course.courseId === courseId
                );

                if (existingCourse) {
                    // If the courseId exists, check if the categoryName exists in categories
                    const existingCategory = existingCourse.categories.find(
                        (category) => category.categoryName.toLowerCase() === categoryName.toLowerCase()
                    );

                    if (!existingCategory) {
                        // If the categoryName doesn't exist, add it to the categories array
                        const result1 = await redemptionCategoryCollection.updateOne(
                            {
                                organizationId,
                                "courses.courseId": courseId,
                            },
                            {
                                $push: {
                                    "courses.$.categories": {
                                        categoryName,
                                    },
                                },
                            }
                        );

                        res.send(result1);
                    }
                }
                else {
                    // If the courseId doesn't exist, create a new course object and add it to the courses array
                    const result2 = await redemptionCategoryCollection.updateOne(
                        {
                            organizationId,
                        },
                        {
                            $push: {
                                courses: {
                                    courseId,
                                    categories: [
                                        {
                                            categoryName,
                                        },
                                    ],
                                },
                            },
                        }
                    );

                    res.send(result2)
                }
            } else {
                // If the organizationId doesn't exist, create a new document
                const result3 = await redemptionCategoryCollection.insertOne({
                    organizationId,
                    courses: [
                        {
                            courseId,
                            categories: [
                                {
                                    categoryName,
                                },
                            ],
                        },
                    ],
                });

                res.send(result3)
            }
        });

        app.get('/redemption_categories/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { organizationId: id };
            const result = await redemptionCategoryCollection.findOne(filter);
            res.send(result);
        });



        //update a redemption categoryName
        app.put("/redemption_categories/categoryName", async (req, res) => {
            const { organizationId, courseId, oldCategoryName, newCategoryName } = req.body;

            // Find the organization
            const organization = await redemptionCategoryCollection.findOne({ organizationId });
            if (!organization) {
                res.status(404).json({ error: "Organization not found" });
                return;
            }

            // Find the course
            const course = organization.courses.find((c) => c.courseId === courseId);
            if (!course) {
                res.status(404).json({ error: "Course not found" });
                return;
            }

            const categoryExists = course.categories.some(
                (cat) => cat.categoryName.toLowerCase() === newCategoryName.toLowerCase()
            );

            if (categoryExists) {
                res.status(400).json({ error: "Category already exists. Please choose another name." });
                return;
            }

            // Find the category
            const category = course.categories.find(
                (cat) => cat.categoryName.toLowerCase() === oldCategoryName.toLowerCase()
            );

            if (!category) {
                res.status(404).json({ error: "Category not found" });
                return;
            }

            // Update the category name
            category.categoryName = newCategoryName;

            // Update the organization in the database
            const result = await redemptionCategoryCollection.updateOne(
                { organizationId },
                { $set: { courses: organization.courses } }
            );



            res.send(result);

        });

        //Delete a redemption category
        app.put("/redemption/deleteCategory", async (req, res) => {

            const { organizationId, courseId, categoryName } = req.body;

            const organization = await redemptionCategoryCollection.findOne({ organizationId });
            if (!organization) {
                res.status(404).json({ error: "Organization not found" });
                return;
            }

            // Find the course
            const course = organization.courses.find((c) => c.courseId === courseId);
            if (!course) {
                res.status(404).json({ error: "Course not found" });
                return;
            }

            // Find the category index
            const categoryIndex = course.categories.findIndex(
                (cat) => cat.categoryName.toLowerCase() === categoryName.toLowerCase()
            );

            console.log(categoryIndex);

            if (categoryIndex === -1) {
                res.status(404).json({ error: "Category not found" });
                return;
            }


            // Remove the category
            course.categories.splice(categoryIndex, 1);


            // Update the organization in the database
            const result = await redemptionCategoryCollection.updateOne(
                { organizationId },
                { $set: { courses: organization.courses } }
            );

            res.send(result);

        });

        app.post('/redemptionItems', async (req, res) => {
            const { organizationId, courseId, categoryName, redemptionItem } = req.body;

            const document = await redemptionCategoryCollection.findOne({
                organizationId,
                "courses.courseId": courseId,
                "courses.categories.categoryName": categoryName,
            });

            if (!document) {
                res.status(404).json({ error: "Document not found" });
                return;
            }

            console.log(document);

            const matchingCourse = document.courses.find(
                (course) => course.courseId === courseId
            );

            // Find the category with matching categoryName
            const matchingCategory = matchingCourse.categories.find(
                (category) => category.categoryName === categoryName
            );

            if (!matchingCategory) {
                res.status(404).json({ error: "Category not found" });
                return;
            }

            // Initialize the redemptionItems array if it doesn't exist
            if (!matchingCategory.redemptionItems) {
                matchingCategory.redemptionItems = [];
            }

            // Check if the redemption item name already exists
            const existingRedemptionItem = matchingCategory.redemptionItems.find(
                (item) => item.redemptionItemName === redemptionItem.redemptionItemName
            );

            if (existingRedemptionItem) {
                res.status(400).json({ error: "redemption item name already exists. Please provide another name." });
                return;
            }

            // Add the new earning item to the array
            matchingCategory.redemptionItems.push(redemptionItem);

            // Save the updated document back to the collection
            const result = await redemptionCategoryCollection.replaceOne(
                { organizationId },
                document
            );

            res.send(result);

        });

        app.get('/weeks/:courseId', async (req, res) => {
            const id = req.params.courseId;
            const filter = { courseId: id };
            const result = await redemptionCategoryCollection.findOne(filter);
            res.send(result);
        });

        //edit redemption item
        app.put("/editRedemptionItem", async (req, res) => {
            const {
                organizationId,
                courseId,
                categoryName,
                oldItemName,
                redemptionItem,
            } = req.body;

            // Find the document to update
            const document = await redemptionCategoryCollection.findOne({
                organizationId,
                "courses.courseId": courseId,
                "courses.categories.categoryName": categoryName,
            });

            if (!document) {
                res.status(404).json({ error: "Document not found" });
                return;
            }

            // Update the skill details within the category
            document.courses.forEach((course) => {
                course.categories.forEach((category) => {
                    if (category.categoryName === categoryName) {
                        category.redemptionItems = category.redemptionItems?.map((existingItem) => {
                            if (existingItem.redemptionItemName === oldItemName) {
                                return {
                                    redemptionItemName: redemptionItem.redemptionItemName,
                                    redemptionValue: redemptionItem.redemptionValue,
                                    itemValue: redemptionItem.itemValue,
                                    minimumValue: redemptionItem.minimumValue,
                                    redemptionLevel: redemptionItem.redemptionLevel,
                                    redemptionLink: redemptionItem.redemptionLink,
                                    selectedIcon: redemptionItem.selectedIcon,
                                    description: redemptionItem.description,
                                };
                            }
                            return existingItem;
                        });
                    }
                });
            });

            // Save the updated document back to the collection
            const result = await redemptionCategoryCollection.replaceOne(
                { organizationId },
                document
            );

            res.send(result)
        });

        //delete redemption item
        app.delete("/deleteRedemptionItem", async (req, res) => {
            const { organizationId, courseId, categoryName, redemptionItemName } = req.body;


            // Find the document to update
            const document = await redemptionCategoryCollection.findOne({
                organizationId,
                "courses.courseId": courseId,
                "courses.categories.categoryName": categoryName,
            });

            if (!document) {
                res.status(404).json({ error: "Document not found" });
                return;
            }

            // Update the document by removing the skill
            document.courses.forEach((course) => {
                course.categories.forEach((category) => {
                    if (category.categoryName === categoryName) {
                        category.redemptionItems = category.redemptionItems?.filter(
                            (skill) => skill.redemptionItemName !== redemptionItemName
                        );
                    }
                });
            });

            // Save the updated document back to the collection
            const result = await redemptionCategoryCollection.replaceOne(
                { organizationId },
                document
            );

            res.send(result);

        });

        app.get('/redemptionCollections/:organizationId', async (req, res) => {
            const id = req.params.organizationId;
            const filter = { organizationId: id };

            const result = await redemptionCategoryCollection.findOne(filter);
            res.send(result);
        });

        app.post('/redemptionAccess', async (req, res) => {
            const { organizationId, userId, accessItem } = req.body;

            const document = await redemptionAccessCollection.findOne({
                organizationId,
                userId,
            });

            if (!document) {
                const result = await redemptionAccessCollection.insertOne({
                    organizationId,
                    userId,
                    accessItems: [
                        {
                            redemptionItemName: accessItem.redemptionItemName,
                            itemValue: accessItem.itemValue,
                            dateAndTime: accessItem.dateAndTime,
                        },
                    ],
                });

                res.send(result);
            } else {


                const updatedDocument = await redemptionAccessCollection.findOneAndUpdate(
                    { organizationId, userId },
                    {
                        $push: {
                            accessItems: {
                                redemptionItemName: accessItem.redemptionItemName,
                                itemValue: accessItem.itemValue,
                                dateAndTime: accessItem.dateAndTime,
                            },
                        },
                    },
                    { returnDocument: 'after' } // This option ensures you get the updated document after the update operation
                );

                res.send(updatedDocument.value);
                console.log(updatedDocument.value)
            }
        });

        // Find assignment submission by organization
        app.get('/getRedemptionAccess/:organizationId/:userId', async (req, res) => {
            const organizationId = req.params.organizationId;
            const userId = req.params.userId;
            const query = {
                'organizationId': organizationId,
                'userId': userId
            };

            try {
                const submissions = await redemptionAccessCollection.findOne(query);
                res.status(200).send(submissions);
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });




        ////////// sohan's code ////////////











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


        // Replace with your actual credentials
        // const clientId = 'e_FuOBgNQwC1bQu3AJT5yg';
        // const clientSecret = 'Wgk4MOvEykfhWjTVYdSOR1Jt3IP3wQ17';
        // const redirectUri = 'http://localhost:5000'; // This should be a URL registered in your Zoom OAuth app

        // // Step 1: Redirect the user to the Zoom OAuth consent page
        // app.get('/authorize', (req, res) => {
        //     const authorizeUrl = `https://zoom.us/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`;
        //     res.redirect(authorizeUrl);
        // });

        // // Step 2: Handle the redirect from Zoom after user consent
        // app.get('/callback', async (req, res) => {
        //     const code = req.query.code;

        //     try {
        //         // Step 3: Exchange the authorization code for an access token
        //         const tokenResponse = await axios.post('https://zoom.us/oauth/token', null, {
        //             params: {
        //                 grant_type: 'authorization_code',
        //                 code: code,
        //                 client_id: clientId,
        //                 client_secret: clientSecret,
        //                 redirect_uri: redirectUri
        //             },
        //         });

        //         const accessToken = tokenResponse.data.access_token;

        //         // Step 4: Create a meeting using the obtained access token
        //         const meetingResponse = await axios.post('https://api.zoom.us/v2/users/me/meetings', {
        //             topic: "My Meeting",
        //             type: 2
        //         }, {
        //             headers: {
        //                 'Content-Type': 'application/json',
        //                 'Authorization': `Bearer ${accessToken}`
        //             },
        //         });

        //         res.send({ result: meetingResponse.data });
        //     } catch (error) {
        //         console.error("Error:", error.response.data);
        //         res.status(500).send("Error creating meeting");
        //     }
        // });



        app.post('/createMeeting', async (req, res) => {
            try {
                const clientID = process.env.zoom_clientId;
                const clientSecret = process.env.zoom_clientSecret;
                const redirectURI = process.env.zoom_redirectUri; // The same as used in your frontend
                // Step 1: Exchange authorization code for access token
                const authCode = req.body.authCode;
                const manageClass = req.body.manageClass;

                const tokenResponse = await axios.post('https://zoom.us/oauth/token', null, {
                    params: {
                        grant_type: 'authorization_code',
                        code: authCode,
                        redirect_uri: redirectURI,
                    },
                    auth: {
                        username: clientID,
                        password: clientSecret,
                    },
                });

                const accessToken = tokenResponse.data.access_token;



                // Step 2: Use access token to create a meeting
                const meetingResponse = await axios.post(
                    'https://api.zoom.us/v2/users/me/meetings',
                    manageClass,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );

                res.send(
                    {
                        tokenResponse: tokenResponse.data,
                        meeting: meetingResponse.data
                    }
                );
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'An error occurred' });
            }
        });


        app.post('/recordings/:id', async (req, res) => {
            try {
                // console.log("api called");
                const clientID = process.env.zoom_clientId;
                const clientSecret = process.env.zoom_clientSecret;
                const redirectURI = process.env.zoom_redirectUri2; // The same as used in your frontend
                // Step 1: Exchange authorization code for access token
                const authCode = req.body.authCode;
                const id = req.params.id;

                // console.log("Meeting Id",typeof +id);

                const tokenResponse = await axios.post('https://zoom.us/oauth/token', null, {
                    params: {
                        grant_type: 'authorization_code',
                        code: authCode,
                        redirect_uri: redirectURI,
                    },
                    auth: {
                        username: clientID,
                        password: clientSecret,
                    },
                });

                const accessToken = tokenResponse.data.access_token;

                const meetingId = +id;


                // Step 2: Use access token to create a meeting
                const response = await axios.get(
                    `https://api.zoom.us/v2/meetings/${meetingId}/recordings`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );

                res.send(
                    {
                        meeting: response.data
                    }
                );
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'An error occurred' });
            }
        });



        const job = nodeCron.schedule("0 21 * * *", async () => {
            const currentDate = new Date();

            const formattedCurrentDate = currentDate.toISOString().slice(0, 10);

            const classes = await classCollection.find({
                courseStartingDateTime: { $regex: `^${formattedCurrentDate}` }, // Use regex to match the formatted date
                duration: { $gt: 0 }
            }).toArray();


            const filteredClasses = classes.filter(classData => !classData.marked && classData.participants && classData.participants.length > 0);

            for (const classData of filteredClasses) {
                const courseStartingDateTime = new Date(classData.courseStartingDateTime);
                const courseEndTime = new Date(courseStartingDateTime.getTime() + classData.duration * 60000); // Convert duration to milliseconds

                // console.log(classData?.agenda,courseEndTime , currentDate);

                if (courseEndTime < currentDate) {
                    // The class has not ended yet; you can perform your action here
                    // For example, you can log or execute some code.

                    // console.log("Time passed");

                    for (const participantData of classData.participants) {
                        const participantEmail = participantData.participant.email;

                        const user = await userCollection.findOne({ "email": participantEmail });
                        if (!user) {
                            // Handle the case where the user is not found
                            continue;
                        }

                        // console.log(user?.name);

                        // Loop through categories, earning items, and values from the class
                        classData.earningParameterData.forEach(category => {
                            const categoryName = category.categoryName;
                            // console.log(categoryName);
                            category.earningItems.forEach(item => {
                                const earningItemName = item.earningItemName;
                                const itemValue = parseFloat(item.itemValue); // Parse item value as a float
                                // console.log(earningItemName , itemValue);
                                // Process the category and earning item data
                                if (!user.earningData) {
                                    user.earningData = [];
                                }

                                let categoryIndex = user.earningData.findIndex(category => category.categoryName === categoryName);

                                if (categoryIndex >= 0) {
                                    let itemIndex = user.earningData[categoryIndex].earningItems.findIndex(item => item.earningItemName === earningItemName);
                                    if (itemIndex >= 0) {
                                        user.earningData[categoryIndex].earningItems[itemIndex].totalItemValue += itemValue;
                                    } else {
                                        user.earningData[categoryIndex].earningItems.push({
                                            "earningItemName": earningItemName,
                                            "totalItemValue": itemValue
                                        });
                                    }
                                } else {
                                    user.earningData.push({
                                        "categoryName": categoryName,
                                        "earningItems": [
                                            {
                                                "earningItemName": earningItemName,
                                                "totalItemValue": itemValue
                                            }
                                        ]
                                    });
                                }

                                // console.log(user?.earningData);
                            });
                        });

                        await userCollection.updateOne({ "email": participantEmail }, { $set: { "earningData": user.earningData } });
                    }

                    // Mark the class as done
                    await classCollection.updateOne({ "_id": classData._id }, { $set: { "marked": true } });
                    console.log("Marked");
                }
            }

        });




    } finally {
        // Ensures that the client will close when you finish/error
        //  await client.close();
    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})