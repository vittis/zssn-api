import 'reflect-metadata';
import Dotenv from 'dotenv';
import { InversifyExpressServer } from 'inversify-express-utils';
import bodyParser from 'body-parser';
import { DbConnection } from './db/connection.db';
import { IoCContainer } from './ioc/container';
import './ioc/loader';

Dotenv.config();

// load everything needed to the Container
const container = IoCContainer.Load();

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

  serverInstance.listen(process.env.PORT || 3030, () => {
    console.log(`Server listening on port ${process.env.PORT || 3030}`);
  });
});
