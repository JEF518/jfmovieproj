const dataPath = "./data/real-data/watched.json";
var fs = require('fs');


const randomiseWatchedRoutes = (app, fs) => {
    app.get("/watched/randomise", (req, res) => {
        res.render("randomise", { watched: true });
    });

    app.get("/watched/random-movie-submit", (req, res) => {
        var oneGenreFilms = []
        var requestedGenre = req.query.genre;
        fs.readFile(dataPath, "utf8", (err, data) => {
            if (err) {
                throw err;
            }
            var films = JSON.parse(data);
            for (let i = 0; i < films.movies.length; i++) {
                if (films.movies[i].category == requestedGenre) {
                    oneGenreFilms.push(films.movies[i]);
                }
            };
            const randomFilm = oneGenreFilms[Math.floor(Math.random() * oneGenreFilms.length)];
            setTimeout(() => {
                return res.redirect('/film/title/' + randomFilm.title + '/year/' + randomFilm.year + '/plot')
            }, 1000)
        })

    });

    app.get("/watched/random", (req, res) => {
        fs.readFile(dataPath, "utf8", (err, data) => {
            if (err) {
                throw err;
            }
            var allFilms = JSON.parse(data).movies;
            const randomFilm = allFilms[Math.floor(Math.random() * allFilms.length)];
            setTimeout(() => {
                return res.redirect('/film/title/' + randomFilm.title + '/year/' + randomFilm.year + '/plot')
            }, 1000)
        })
    });

}
module.exports = randomiseWatchedRoutes;