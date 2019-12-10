import 'reflect-metadata';
import { DbConnection } from './db/connection.db';
import { ContainerConfigLoader } from './config/container';
import * as bodyParser from 'body-parser';
import { InversifyExpressServer } from 'inversify-express-utils';

import './controllers/survivor.controller';

const PORT = 8080;

// load everything needed to the Container
const container = ContainerConfigLoader.Load();

DbConnection.initConnection().then(() => {
  DbConnection.setAutoReconnect();

  const server = new InversifyExpressServer(container);

  server.setConfig(app => {
    app.use(
      bodyParser.urlencoded({
        extended: true,
      }),
    );
    app.use(bodyParser.json());
  });

  const serverInstance = server.build();

  serverInstance.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
});
