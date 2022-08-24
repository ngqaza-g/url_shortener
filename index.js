const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const ShortUrl = require('./models/shortUrl');
const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect(`mongodb://${process.env.MONGODB_URL}/urlShortener`,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));


app.get('/', async (req, res)=>{
    const shortUrls = await ShortUrl.find();
    res.render('index', {shortUrls});
})

// Creating short urls and saving into the database
app.post('/shortUrls', async(req, res)=>{
    await ShortUrl.create({full: req.body.fullUrl});
    res.redirect('/');
});


// Handling short url requests 
app.get('/:shortUrl', async (req, res)=>{
    // search the database for the url
    const shortUrl = await ShortUrl.findOne({short: req.params.shortUrl});
    // Send a 404 status if not found
    if(shortUrl == null) return res.sendStatus(404);

    // Icreament the number of clicks and save
    shortUrl.clicks++;
    shortUrl.save();
    // Redirect user to full url link
    res.redirect(shortUrl.full);
})


app.listen(PORT, ()=> console.log(`SERVER STARTED ON PORT ${PORT}`));
