import express from 'express';
import handlebars from 'express-handlebars'
import __dirname from './utils.js';

import productsRouter from './routes/products.routes.js';
import cartsRouter from "./routes/carts.routes.js";
import viewsRouter from './routes/views.routes.js';
import sessionRouter from "./routes/session.routes.js"

import { Server } from "socket.io";
import session from "express-session";
import { initializePassport } from "./config/passpot.config.js";
import { connectMongoDB } from "./config/mongoDB.config.js";
import cookieParser from "cookie-parser";


const app = express();

connectMongoDB();
initializePassport();

const PORT = process.env.PORT||8080;

const server = app.listen(PORT,()=>console.log(`Listening on ${PORT}`));

app.engine('handlebars',handlebars.engine({runtimeOptions:{allowProtoPropertiesByDefault:true}}));
app.set('views',`${__dirname}/views`);
app.set('view engine','handlebars');


app.use(express.static(`${__dirname}/public`))
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(
    session({
      secret: "secret",
      resave: true,
      saveUninitialized: true, 
    })
  );

//mongoose.connect("mongodb+srv://danielcaballero3960:4LIeay23kOXQ361V@cluster0.i9wld.mongodb.net/ecomerce?retryWrites=true&w=majority&appName=Cluster0");

app.use(cookieParser("secretKey"))

app.use('/',viewsRouter);
app.use('/api/products',productsRouter);
app.use("/api/carts",cartsRouter);
app.use("/sessions", sessionRouter);

export const io = new Server(server);

io.on("connection", (socket) => {
  console.log("Nuevo usuario Conectado");
});




