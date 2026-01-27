const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const port = process.env.PORT || 3000;
const baseUrl = process.env.BASE_URL || `http://localhost:${port}`;

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ChainVerse Academy API',
      version: '1.0.0',
      description: 'API documentation for ChainVerse Academy',
    },
    servers: [
      {
        url: baseUrl,
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    headers: {
        'X-RateLimit-Limit': {
          description: 'The number of allowed requests in the current period',
          schema: {
            type: 'integer'
          }
        },
        'X-RateLimit-Remaining': {
          description: 'The number of remaining requests in the current period',
          schema: {
            type: 'integer'
          }
        },
        'X-RateLimit-Reset': {
          description: 'The time when the rate limit resets',
          schema: {
            type: 'string',
            format: 'date-time'
          }
        },
        'Retry-After': {
          description: 'The number of seconds to wait before retrying',
          schema: {
            type: 'integer'
          }
        }
      },
    security: [{ BearerAuth: [] }],
  },
  apis: ['./routes/*.js', './src/routes/*.js', './src/controllers/*.js'], // adjust to your structure
};

const swaggerSpec = swaggerJSDoc(options);

const setupSwaggerDocs = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log(`Swagger docs available at ${baseUrl}/api-docs`);
};

module.exports = setupSwaggerDocs;
