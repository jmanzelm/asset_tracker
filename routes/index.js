const userRoutes = require("./users");
const bodyParser = require('body-parser');

const constructorMethod = app => {
  app.use(bodyParser.json());
  app.use("/", userRoutes);

  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not found" });
  });
};

module.exports = constructorMethod;