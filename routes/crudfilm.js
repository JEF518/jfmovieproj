const axios = require("axios");
var mcache = require("memory-cache");
var fs = require("fs");
let dataPath = "./data/real-data/movies.json";
let watchedDataPath = "./data/real-data/watched.json";

const dvdPath = "./data/real-data/dvds.json";
require("dotenv").config();
var accents = require("remove-accents");

const crudFilmRoutes = (app, fs) => {
  app.get("/edit-film-screen/title/:title/year/:year", (req, res) => {
    if (req.query.watched) {
      dataPath = "./data/real-data/watched.json";
    }
    fs.readFile(dataPath, "utf8", (err, data) => {
      if (err) {
        throw err;
      }
      var films = JSON.parse(data);
      var theFilm = () => {
        for (let i = 0; i < films.movies.length; i++) {
          console.log(films.movies[i].title);
          if (films.movies[i].title === req.params.title) {
            console.log("we've got a match it's... ", films.movies[i]);
            const movie = films.movies[i];
            return { data: { movie } };
          }
        }
      };
      console.log(theFilm);
      res.render("edit-film-screen", theFilm());
    });
  });
  app.get("/edit-film/title/:title", (req, res) => {
    console.log("trying to edit film...");
    if (req.query.watched) {
      dataPath = "./data/real-data/watched.json";
    }
    fs.readFile(dataPath, "utf8", (err, data) => {
      if (err) {
        throw err;
      }
      const allFilms = JSON.parse(data);
      let newFilms = [];
      for (let i = 0; i < allFilms.movies.length; i++) {
        console.log(allFilms.movies[i].title);
        if (allFilms.movies[i].title === req.params.title) {
          allFilms.movies[i].category = req.query.genre;
          if (req.query.watched === "on") {
            console.log("film has been watched...");

            allFilms.movies[i].watched = req.query.watched;
            setFilmWatched(allFilms.movies[i]);
          } else {
            allFilms.movies[i].watched = false;
            setFilmWatched(allFilms.movies[i]);
            newFilms.push(allFilms.movies[i]);
          }
        } else {
          console.log("adding... ", allFilms.movies[i], "back to the data");
          newFilms.push(allFilms.movies[i]);
        }
      }
      console.log("newfilms is...", newFilms);
      fs.writeFile(
        dataPath,
        '{"movies":' + JSON.stringify(newFilms) + "}",
        (err) => {
          if (err) throw err;
          console.log("The file has been saved!");
        }
      );
      //   console.log(theFilm);
      res.render("home");
    });
  });
  app.get("/add-film-screen", (req, res) => {
    res.render("add-films-screen");
  });
  app.get("/delete-film-screen", (req, res) => {
    res.render("delete-films-screen");
  });
  app.get("/add-film", (req, res) => {
    res.render("message-screen", data);
  });
  app.get("/delete-film/title/:title/year/:year", (req, res) => {
    console.log("trying to delete film...");
    fs.readFile(dataPath, "utf8", (err, data) => {
      if (err) {
        throw err;
      }
      const allFilms = JSON.parse(data);
      let newFilms = [];
      for (let i = 0; i < allFilms.movies.length; i++) {
        console.log(allFilms.movies[i].title);
        if (allFilms.movies[i].title === req.params.title) {
          console.log("removing... ", allFilms.movies[i], "from the data");
        } else {
          console.log("adding... ", allFilms.movies[i], "back to the data");
          newFilms.push(allFilms.movies[i]);
        }
      }
      console.log("newfilms is...", newFilms);
      fs.writeFile(
        dataPath,
        '{"movies":' + JSON.stringify(newFilms) + "}",
        (err) => {
          if (err) throw err;
          console.log("The file has been saved!");
        }
      );
      //   console.log(theFilm);
      res.render("home");
    });
  });
};
function setFilmWatched(film) {
  console.log("trying to set film to watched...");

  fs.readFile(watchedDataPath, "utf8", (err, data) => {
    if (err) {
      throw err;
    }

    const Films = JSON.parse(data).movies;
    console.log("existing watched films: ", Films);

    Films.push(film);
    fs.writeFile(
      watchedDataPath,
      '{"movies":' + JSON.stringify(Films) + "}",
      (err) => {
        if (err) throw err;
        console.log("The watched movies file has been updated and saved!");
      }
    );
  });
}

function setFilmUnwatched(film) {
  console.log("trying to set film to unwatched...");

  fs.readFile(dataPath, "utf8", (err, data) => {
    if (err) {
      throw err;
    }

    const Films = JSON.parse(data).movies;
    console.log("existing unwatched films: ", Films);

    Films.push(film);
    fs.writeFile(
      dataPath,
      '{"movies":' + JSON.stringify(Films) + "}",
      (err) => {
        if (err) throw err;
        console.log("The unwatched movies file has been updated and saved!");
      }
    );
  });
}

function amendFilmGenre(film, newGenre) {}
module.exports = crudFilmRoutes;
