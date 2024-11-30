const express=require('express');
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const Brand=require('./models/Brand');

const app=express();
const port=3000;

//MongoDB connection 
mongoose.connect('mongodb+srv://hazel_mongo:Jan.282004@cluster0.bzvv7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
.then(()=>console.log('Connected to MongoDB'))
.catch(err=>console.error('Error connecting to MongoDB',err));

//Middleware
app.use(bodyParser.urlencoded({ extended:true}));
app.use(express.static ('public'));

//Set EJS at the view engine
app.set('view engine','ejs');

//Routes 
//Home page - show all brands and the the form for adding a new brand
app.get('/',async(req,res)=>{
    try{
        const brands=await Brand.find();
        res.render('index',{brands});
    } catch(err){
        console.log(err);
        res.status(500).send('Server error');
    }
});
//Add New Brand
app.post('/add',async(req,res)=>{
    try{
        const newBrand=new Brand({
            name:req.body.name,
            description:req.body.description
        });
        await newBrand.save();
        res.redirect('/');
    }catch(err){
        console.log(err) 
            console.log(err);
            res.status(500).send('Error adding Brand');
    }
});

//Edit brand page - Prepopulate he form with the exisiting data
app.get('/edit/:id',async(req,res)=>{
    try{
        const brand=await Brand.findById(req.params.id);
        if(!brand) return res.status(404).send('Brand not found');
        res.render('edit',{brand});
    }catch(err){
        console.log(err);
        res.status(500).send('Server error')
    }
});

//Update brand
app.post('/edit/:id',async(req,res)=>{
    try{
        await Brand.findByIdAndUpdate(req.params.id,req.body);
        res.redirect('/');
    }catch(err){
        console.log(err);
        res.status(500).send('Error updating brand');
    }
});

//delete brand
app.post('/delete/:id',async(req,res)=>{
    try{
        await Brand.findByIdAndDelete(req.params.id,req.body);
        res.redirect('/');
    }catch(err){
        console.log(err);
        res.status(500).send('Error deleting brand');
    }
});

//Start the Server
app.listen(port,()=>{
    console.log(`Connected to server at http://localhost:${port}`)
}); 