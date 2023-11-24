
const mongoose = require('mongoose');
const cities = require('./cities')
const {places, descriptors} = require('./seedHelpers')
const Campground = require('../models/campground');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', ()=>{
    console.log('Database connected')
});

const titleSample = array => array[Math.floor(Math.random()*array.length)];

const seedDB = async ()=>{
    await Campground.deleteMany();
    for (let i=0; i<50; i++){
        const random1000 = Math.floor(Math.random()*1000);
        const randomPrice = Math.floor(Math.random()*30)+20;
        const camp = new Campground({
            location: `${cities[random1000].city}-${cities[random1000].state}`,
            title: `${titleSample(descriptors)} ${titleSample(places)}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis delectus maiores sequi quisquam nisi corporis labore iure nobis nostrum architecto dolorum itaque, unde assumenda cum, deleniti praesentium culpa? Sequi, voluptates!',
            price: randomPrice
        
        })
        await camp.save();
    }
}

seedDB()
.then(()=>{
    mongoose.connection.close();
})
