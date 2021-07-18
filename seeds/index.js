const mongoose = require('mongoose');
const cities = require("./cities.js");
const {places, descriptors} = require("./seedHelpers.js");
const Campground = require("../models/campground.js");

mongoose.connect('mongodb://localhost:27017/yelp-camp', {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Yelp-Camp DB Connected!")
});



const sample = arrayFunc => arrayFunc[Math.floor(Math.random() * arrayFunc.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i<500; i++) {
        const random1000 = Math.floor(Math.random()*1000);
        const price = Math.floor(Math.random()* 35) + 10
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            geometry: { 
              type: "Point",
              coordinates: [
                cities[random1000].longitude,
                cities[random1000].latitude
              ]
            }, // GeoJSON uses long, lat in this order but google maps uses lat, long
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                  url: 'https://res.cloudinary.com/deinx01pu/image/upload/v1626610415/YelpCamp/xvge8tcbbz1j0gq0dfxq.jpg',
                  filename: 'YelpCamp/xvge8tcbbz1j0gq0dfxq'
                },
                {
                  url: 'https://res.cloudinary.com/deinx01pu/image/upload/v1626610416/YelpCamp/cfklghw660npmovatrqd.jpg',
                  filename: 'YelpCamp/cfklghw660npmovatrqd'
                },
                {
                  url: 'https://res.cloudinary.com/deinx01pu/image/upload/v1626610408/YelpCamp/f5zifny8vjcaninetipx.jpg',
                  filename: 'YelpCamp/f5zifny8vjcaninetipx'
                }
              ],
            description: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Reprehenderit deserunt praesentium dolore voluptatibus mollitia earum excepturi ea beatae, nemo placeat quidem, assumenda debitis officia numquam cumque sunt nisi facilis totam.",
            price,
            author: "60f41a77246be52308b0c756" // hard coded. so if you reset app, first create a user in app to work
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})