const express = require("express");
const connectDB = require("./db");
const app = express();

connectDB();

// console.log(config.g)
const PORT = 5000;

app.use(express.json({ extended: false }));

app.use("/api", require("./routes/index"));
app.use("/task", require("./routes/task"));

app.listen(PORT, () => {
  console.log(`Port listen on ${PORT}`);
});
