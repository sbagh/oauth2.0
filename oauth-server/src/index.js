import express from "express";

const app = express();
app.use(express.json());

const PORT = 3005;

app.get("/authorize", (req, res) => {});

app.get("/token", (req, res) => {});

app.listen(PORT, () => {
   console.log(`Server running on port `, PORT);
});
