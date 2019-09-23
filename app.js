const express = require("express");
const app = express();

app.use(express.static("public"));
app.use("/", require("./routes/routes"));
app.use("/", require("./routes/uploads"));
app.use("/", require("./routes/admin_routes"));
app.set("view engine", "pug");
app.set("views", "./views");

app.listen(3000, () => {
  console.log("Running on port 3000...");
});
