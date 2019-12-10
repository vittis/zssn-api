import express from 'express';
import { exampleRouter } from './example.router';
import { DbConnection } from './db/connection.db';

const PORT = 8080;

DbConnection.initConnection().then(mongod => {
  DbConnection.setAutoReconnect();

  const app = express();

  app.use(exampleRouter);

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
});
