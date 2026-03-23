require("dotenv").config();

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const authRoutes = require("./auth/authRoutes");

app.use(express.json())

app.use("/auth", authRoutes);

app.listen(port, () => {
  console.log(`Servidor está executando na porta ${port}`);
});
