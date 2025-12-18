module.exports = {
  apps: [
    {
      name: 'api-gateway',
      script: 'backend/api-gateway/index.js',
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'auth-service',
      script: 'backend/auth-service/index.js',
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'content-service',
      script: 'backend/content-service/index.js',
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'progress-service',
      script: 'backend/progress-service/index.js',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};


