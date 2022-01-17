import express from "express";
import connectWithDataBase from "./database.js";
import fileRoute from "./routes/file.js";

const app = express();
const port = 3000;

app.use(express.json());
connectWithDataBase();

// Home
app.get("/", (req, res) => res.send("Hello World!"));

// File Route
app.use("/api/v1/file", fileRoute);

app.listen(port, () =>
  console.log(`Example app listening on port http://localhost:${port}`)
);
