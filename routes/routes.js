const filmRoutes = require("./films");

const appRouter = (app, fs) => {
    // we've added in a default route here that handles empty routes
    // at the base API url

    filmRoutes(app, fs);
};

module.exports = appRouter;