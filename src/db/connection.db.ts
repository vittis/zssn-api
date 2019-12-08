import mongoose from "mongoose";

export class DbConnection {
    public static async initConnection() {
        process.env.DB_CONN_STR = `mongodb://${process.env.DB_IP || "mongo"}:${process.env.DB_PORT || "27017"}/${process.env.DB_DB_NAME || "zssn-db"}`;
        await DbConnection.connect(process.env.DB_CONN_STR);
    }

    public static async connect(connStr: string) {
        console.log('conecta carai');
       return mongoose.connect(
            connStr,
            {useNewUrlParser: true, useFindAndModify: false},
        )
            .then(() => {
                console.log(`Successfully connected to ${connStr}`);
            })
            .catch((error) => {
                console.error("Error connecting to database: ", error);
                return process.exit(1);
            });
    }

    public static setAutoReconnect() {
        mongoose.connection.on("disconnected", () => DbConnection.connect(process.env.DB_CONN_STR));
    }

    public static async disconnect() {
       await mongoose.connection.close();
    }
}