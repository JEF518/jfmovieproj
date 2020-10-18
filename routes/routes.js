const filmRoutes = require("./films");
const randomiseRoutes = require("./randomise");
const watchedRoutes = require("./watched");
const randomiseWatchedRoutes = require("./randomise-watched");

const appRouter = (app, fs) => {
  // we've added in a default route here that handles empty routes
  // at the base API url
  watchedRoutes(app, fs);
  randomiseRoutes(app, fs);
  filmRoutes(app, fs);
  randomiseWatchedRoutes(app, fs);
};

module.exports = appRouter;
