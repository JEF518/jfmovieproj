const filmRoutes = require("./films");
const randomiseRoutes = require("./randomise");
const watchedRoutes = require("./watched");
const randomiseWatchedRoutes = require("./randomise-watched");
const crudFilmRoutes = require("./crudfilm");

const appRouter = (app, fs) => {
  watchedRoutes(app, fs);
  randomiseRoutes(app, fs);
  filmRoutes(app, fs);
  randomiseWatchedRoutes(app, fs);
  crudFilmRoutes(app, fs);
};

module.exports = appRouter;
