const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');


mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 400; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 100) + 20;
        const camp = new Campground({
            author: "601333ddc3f40f26c4ed9ef5",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Temporibus minus ad cumque, nostrum inventore, ex quis sint quam deleniti dolorum pariatur blanditiis. Accusamus nesciunt reiciendis omnis architecto vel voluptate sequi?',
            price,
            images: [
                {
                    url: "https://res.cloudinary.com/dr4w4etdj/image/upload/v1612315528/YelpCamp/yrys76wii6mpam7z73zl.jpg",
                    filename: "YelpCamp/yrys76wii6mpam7z73zl"
                },
                {
                    url: "https://res.cloudinary.com/dr4w4etdj/image/upload/v1612315524/YelpCamp/fyehanot5pjgzoxcnn7l.jpg",
                    filename: "YelpCamp/fyehanot5pjgzoxcnn7l"
                }
            ],
            geometry: {
                type: "Point",
                coordinates: [cities[random1000].longitude, cities[random1000].latitude]
            }
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})