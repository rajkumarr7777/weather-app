const express = require('express');
const path = require('path');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();
const port = process.env.PORT || 3000;

// Define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Abhimanyu'
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Abhimanyu Bhartiya'
    });
});

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        helpText: 'This is some helpful text.',
    });
});

app.get('/weather', (req, res) => {
    const address = req.query.address;
    if (!address) {
        return res.send({error: 'you must provide an address'});
    }
    geocode(address, (error, {latitude, longitude, location} = {}) => {
        if (error) {
            return res.send({error});
        }
        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({error});
            }

            res.send({
                forecast: forecastData,
                location,
                address
            });
        });
    });
});

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'you must provide a search term'
        });
    }
    console.log(req.query);
    res.send([]);
});

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Abhimanyu',
        errorMessage: 'Help Article Not Found.',
    });
});

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Abhimanyu',
        errorMessage: 'Page Not Found.',
    });
});


app.listen(port, () => {
    console.log(`server is up on port ${port}.`);
});