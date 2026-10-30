module.exports = {
  apps: [
    {
      name: 'express-app',
      script: 'dist/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 8000,
      },
    },
  ],
};

