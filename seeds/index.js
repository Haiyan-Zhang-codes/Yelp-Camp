
const mongoose = require('mongoose');
const cities = require('./cities')
const {places, descriptors} = require('./seedHelpers')
const Campground = require('../models/campground');

mongoose.connect('mongodb+srv://haiyan:TDfaBFNXRh4TqOvs@sparkcodeacademy.xxtvoj7.mongodb.net/yelp-camp-haiyan?retryWrites=true&w=majority');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', ()=>{
    console.log('Database connected')
});

const titleSample = array => array[Math.floor(Math.random()*array.length)];

const seedDB = async ()=>{
    await Campground.deleteMany();
    for (let i=0; i<200; i++){
        const random1000 = Math.floor(Math.random()*1000);
        const randomPrice = Math.floor(Math.random()*30)+20;
        const camp = new Campground({
            author: '658105a63db7f3849a4cde85',
            location: `${cities[random1000].city}-${cities[random1000].state}`,
            title: `${titleSample(descriptors)} ${titleSample(places)}`,
            images: [
                {
                  url: 'https://res.cloudinary.com/dv8lv7k6u/image/upload/v1703881308/Haiyan_YelpCamp/wfv5lydpniuqhce8embt.jpg',
                  filename: 'Haiyan_YelpCamp/wfv5lydpniuqhce8embt',
                },
                {
                  url: 'https://res.cloudinary.com/dv8lv7k6u/image/upload/v1703881308/Haiyan_YelpCamp/eeef3mcplynwqcwzrrcm.jpg',
                  filename: 'Haiyan_YelpCamp/eeef3mcplynwqcwzrrcm',
                },
                {
                  url: 'https://res.cloudinary.com/dv8lv7k6u/image/upload/v1703881309/Haiyan_YelpCamp/jzy7f5kdpbm62gc3tpb3.jpg',
                  filename: 'Haiyan_YelpCamp/jzy7f5kdpbm62gc3tpb3',
                }
              ],
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis delectus maiores sequi quisquam nisi corporis labore iure nobis nostrum architecto dolorum itaque, unde assumenda cum, deleniti praesentium culpa? Sequi, voluptates!',
            price: randomPrice,
            geometry: {
              type: 'Point',
              coordinates: [
                cities[random1000].longitude,
                cities[random1000].latitude,
              ]
            }
        
        })
        await camp.save();
    }
}

seedDB()
.then(()=>{
    mongoose.connection.close();
})
