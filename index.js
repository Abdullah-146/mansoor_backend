import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import { connectDB } from "./db/index.js";
import { errorMiddleware } from "./middlewares/index.js";
import userRoutes from "./routes/User/index.js";
import adminRoutes from "./routes/Admin/index.js";
import defaultRoutes from "./routes/index.js";

dotenv.config(); // Configuring Envrionment variables

// Connecting To DB
connectDB();

// Creating express app & registering application level middlewares
const app = express();
app.use(
  cors({
    origin: "*",
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    key: "user",
    secret: process.env.ACCESS_TOKEN_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: false,
      maxAge: 24 * 60 * 60 * 60,
    },
  })
);

// Registering Routes
app.use("/api/v1", defaultRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/admin", adminRoutes);

app.use(errorMiddleware); // registering error middleware

// Creating server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
