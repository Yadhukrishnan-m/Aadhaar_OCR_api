
import express from "express";
import router from "./route";
import { ErrorHandler } from "./middleware/errorHandler"; // adjust path
import cors from 'cors'
import dotenv from "dotenv";
dotenv.config();
import morgan from "morgan";

const app = express();
const PORT = 3000;



app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONTEND_URI,
    credentials: true,
  })
)

app.use(morgan('dev')); 


app.use("/", router);
app.use(ErrorHandler.handleError);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
