const Campground = require('../models/campground')
const {cloudinary} = require('../cloudinary')

module.exports.index = async(req,res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds})
};

module.exports.renderNewForm = (req,res)=>{   
    res.render('campgrounds/new')
};

module.exports.createCampground = async (req,res)=>{    
    const newCampGround = new Campground(req.body.campground);
    newCampGround.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    newCampGround.author = req.user._id;
    await newCampGround.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${newCampGround._id}`) 
 };

 module.exports.showCampground = async (req,res)=>{    
    const campground = await Campground.findById(req.params.id).populate({
        path:'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if(!campground){
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', {campground})
};

module.exports.renderEditForm = async(req,res)=>{
    const campground = await Campground.findById(req.params.id);   
    if(!campground){
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', {campground})
};

module.exports.editCampground = async(req,res)=>{    
    const updatedCampground = await Campground.findByIdAndUpdate(req.params.id, req.body.campground);
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    updatedCampground.images.push(...imgs);
    await updatedCampground.save();
    if(req.body.deleteImages){
        for (let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await updatedCampground.updateOne({$pull: { images : { filename: { $in: req.body.deleteImages}}}})
    }
    req.flash('success', 'Successfully updated the campground!')
    res.redirect(`/campgrounds/${updatedCampground._id}`)
};

module.exports.deleteCampground = async(req,res)=>{
    await  Campground.findByIdAndDelete(req.params.id);
    req.flash('success', 'Deleted a campground!')
    res.redirect('/campgrounds')
}