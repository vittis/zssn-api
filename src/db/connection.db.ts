import mongoose from 'mongoose';

export class DbConnection {
  public static async initConnection(): Promise<void> {
    process.env.DB_CONN_STR = `mongodb://${process.env.DB_IP ||
      'mongo'}:${process.env.DB_PORT || '27017'}/${process.env.DB_DB_NAME ||
      'zssn-db'}`;
    await DbConnection.connect(process.env.DB_CONN_STR);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static async connect(connStr: string): Promise<any> {
    return mongoose
      .connect(connStr, {
        user: 'root',
        pass: 'secret',
        useNewUrlParser: true,
        useFindAndModify: false,
        authSource: 'admin',
      })
      .then(() => {
        console.log(`Successfully connected to ${connStr}`);
      })
      .catch(error => {
        console.error('Error connecting to database: ', error);
        return process.exit(1);
      });
  }

  public static setAutoReconnect(): void {
    mongoose.connection.on('disconnected', () =>
      DbConnection.connect(process.env.DB_CONN_STR),
    );
  }

  public static async disconnect(): Promise<void> {
    await mongoose.connection.close();
  }
}
