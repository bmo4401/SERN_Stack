import express from 'express';
import bodyParser from 'body-parser';
import viewEgine from './config/viewEngine';
import initWebRoutes from './route/web';
import connectDB from './config/connectDB';
import * as dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();
//query params

let app = express();
app.use(
    cors({
        credentials: true, // important
        origin: true,
    }),
);

//config app
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
viewEgine(app);
initWebRoutes(app);

// Connect DB
connectDB();

let port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log('Backend Nodejs is runing on the port : ' + port);
});
