const axios = require('axios');
var mcache = require('memory-cache');
var fs = require('fs');
const dataPath = "./data/real-data/movies.json";
const dvdPath = './data/real-data/dvds.json';
require('dotenv').config();
var accents = require('remove-accents');

const crudFilmRoutes = (app, fs) => {
    app.get("/edit-film-screen/title/:title/year/:year/", (req, res) => {
        fs.readFile(dataPath, "utf8", (err, data) => {
            if (err) {
                throw err;
            }
            var films = JSON.parse(data);
            var theFilm = () => {for (let i = 0; i < films.movies.length; i++) {
                if(film[i].title === req.params.title){
                    return film[i];
                }
            }}
        res.render("edit-film-screen", theFilm);
    })
    app.get("/add-film-screen", (req, res) => {
        res.render("add-films-screen");
    })
    app.get("/delete-film-screen", (req, res) => {
        res.render("delete-films-screen");
    })
    app.get("/add-film", (req, res) => {
        res.render("message-screen", data )
    })
    app.get("/delete-film", (req, res) => {
    })
}

module.exports = crudFilmRoutes;