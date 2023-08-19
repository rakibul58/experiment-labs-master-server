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
        const classCollection = client.db('experiment-labs').collection('classes');
        const readingCollection = client.db('experiment-labs').collection('readings');
        const quizCollection = client.db('experiment-labs').collection('quizes');
        const liveTestCollection = client.db('experiment-labs').collection('liveTests');
        const videoCollection = client.db('experiment-labs').collection('videos');
        const audioCollection = client.db('experiment-labs').collection('audios');
        const fileCollection = client.db('experiment-labs').collection('files');

        const skillCategoryCollection = client.db('experiment-labs').collection('skillCategories');

        const earningCategoryCollection = client.db('experiment-labs').collection('earningCategories');







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


        //get courses by organization id 
        app.get('/courses/organizations/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { "organization.organizationId": id };
            const course = await courseCollection.find(filter).toArray();
            res.send(course);
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


        //tasks
        app.post('/tasks/:id', async (req, res) => {
            const chapterId = req.body.chapterId;
            const taskType = req.params.id;
            const task = req.body;
            const taskName = task.taskName;
            const taskShowType = task.taskShowType;
            // console.log(taskType.charAt(0).toUpperCase() + taskType.slice(1));
            const taskTypeInput = taskType.charAt(0).toUpperCase() + taskType.slice(1);
            let result;

            switch (taskType) {
                case 'assignments':
                    result = await assignmentCollection.insertOne(task);
                    break;
                case 'classes':
                    result = await classCollection.insertOne(task);
                    break;
                case 'readings':
                    result = await readingCollection.insertOne(task);
                    break;
                case 'quizes':
                    result = await quizCollection.insertOne(task);
                    break;
                case 'liveTests':
                    result = await liveTestCollection.insertOne(task);
                    break;
                case 'videos':
                    result = await videoCollection.insertOne(task);
                    break;
                case 'audios':
                    result = await audioCollection.insertOne(task);
                    break;
                case 'files':
                    result = await fileCollection.insertOne(task);
                    break;
                default:
                    return res.status(400).json({ error: 'Invalid task type' });
            }

            res.status(200).json(result);

            const filter = { _id: new ObjectId(chapterId) };
            const options = { upsert: true };

            const newTask = {
                taskId: "" + result?.insertedId,
                taskType: taskTypeInput,
                taskShowType,
                taskName
            };

            const updatedDoc = {
                $push: {
                    tasks: newTask
                }
            };

            const newResult = await chapterCollection.updateOne(filter, updatedDoc, options);

            res.send({ result, newResult });
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

            // Find the category with matching categoryName
            const matchingCategory = document.courses[0].categories.find(
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




        // //get week by courseId
        // app.get('/assignments/:id', async (req, res) => {
        //     const courseId = req.params.id;
        //     const query = { courseId: courseId };
        //     const courses = await weekskillCategoryCollection.find(query).toArray();
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