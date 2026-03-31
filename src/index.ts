import dotenv from "dotenv";
import express, { Application } from "express";
import authRoutes from "./modules/auth/authRoutes";
import imageRoutes from "./modules/image/imageRoutes";

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/images", imageRoutes);

app.listen(port, () => {
  console.log(`Servidor está executando na porta ${port}`);
});
