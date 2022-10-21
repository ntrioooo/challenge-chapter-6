const express = require("express");
const controllers = require("../app/controllers");

const apiRouter = express.Router();

// Open API
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./bloggingAPI.yaml');
apiRouter.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

/**
 * Authentication Resource
 * */
apiRouter.get(
  "/api/v1/whoami",
  controllers.api.v1.authController.authorize,
  controllers.api.v1.authController.whoAmI
);
apiRouter.post("/api/v1/login", controllers.api.v1.authController.login);
apiRouter.post("/api/v1/register", controllers.api.v1.authController.register);
apiRouter.get('/api/v1/user', controllers.api.v1.authController.validationSuperAdmin, controllers.api.v1.authController.listUser);
apiRouter.post("/api/v1/user", controllers.api.v1.authController.validationSuperAdmin, controllers.api.v1.authController.createUser);
apiRouter.put('/api/v1/user/:id', controllers.api.v1.authController.validationSuperAdmin,controllers.api.v1.authController.updateUser);
apiRouter.get('/api/v1/user/:id', controllers.api.v1.authController.validationSuperAdmin, controllers.api.v1.authController.show);
apiRouter.delete(
  '/api/v1/user/:id', controllers.api.v1.authController.validationSuperAdmin, controllers.api.v1.authController.destroy
);

apiRouter.get('/api/v1/cars', controllers.api.v1.carController.list);
apiRouter.post('/api/v1/cars', controllers.api.v1.authController.validationCRUD, controllers.api.v1.carController.create);
apiRouter.put('/api/v1/cars/:id', controllers.api.v1.authController.validationCRUD, controllers.api.v1.carController.update);
apiRouter.get('/api/v1/cars/:id', controllers.api.v1.carController.show);
apiRouter.delete(
  '/api/v1/cars/:id', controllers.api.v1.authController.validationCRUD, controllers.api.v1.carController.destroy
);

apiRouter.use(controllers.api.main.onLost);
apiRouter.use(controllers.api.main.onError);


module.exports = apiRouter;
