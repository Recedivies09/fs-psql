const { SECRET } = require("./config");
const jwt = require("jsonwebtoken");

const requestLogger = (request, response, next) => {
  console.log(`Method: ${request.method}`);
  console.log(`Path: ${request.path}`);
  console.log(`Body: ${JSON.stringify(request.body, null, 2)}`);
  console.log("---");
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name == "SequelizeValidationError") {
    return response.status(400).json({ error: error.message });
  }
  next(error);
};

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
    } catch (error) {
      next(error);
    }
  } else {
    res.status(401).json({ error: "token missing" });
  }
  next();
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
};
