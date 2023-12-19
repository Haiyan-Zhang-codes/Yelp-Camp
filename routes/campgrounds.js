const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const {CampgroundSchema} = require('../schemas.js')



const validateCampground = (req,res,next) =>{
    const {error} = CampgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg, 400)
    }else{
        next();
    }
}




router.get('/', catchAsync(async(req,res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds})
}));

router.get('/new', (req,res)=>{
    if(!req.isAuthenticated()){
        req.flash('error', 'You must be signed in');
        res.redirect('/login')
    }
    res.render('campgrounds/new')
});



router.post('/',validateCampground, catchAsync(async (req,res)=>{
    
   const newCampGround = new Campground(req.body.campground);
   await newCampGround.save();
   req.flash('success', 'Successfully made a new campground!');
   res.redirect(`/campgrounds/${newCampGround._id}`)

}))

router.get('/:id', catchAsync(async (req,res)=>{
    
    const campground = await Campground.findById(req.params.id).populate('reviews')
    if(!campground){
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', {campground})
}));

router.get('/:id/edit', catchAsync(async(req,res)=>{
    const campground = await Campground.findById(req.params.id);   
    res.render('campgrounds/edit', {campground})
}));

router.put('/:id',validateCampground, catchAsync(async(req,res)=>{
    const updatedCampground = await Campground.findByIdAndUpdate(req.params.id, req.body.campground);
    req.flash('success', 'Successfully updated the campground!')
    res.redirect(`/campgrounds/${updatedCampground._id}`)
}));

router.delete('/:id', catchAsync(async(req,res)=>{
    await  Campground.findByIdAndDelete(req.params.id);
    req.flash('success', 'Deleted a campground!')
    res.redirect('/campgrounds')
}));

module.exports = router;