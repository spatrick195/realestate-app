const express = require("express");
const upload = require("./uploads");
const admin_router = express.Router();

admin_router.get("/admin/user/dashboard", (req, res) => {
  res.render("admin/dashboard", {
    title: "Dashboard"
  });
});

admin_router.get("/admin/user/file-uploads", (req, res) => {
  res.render("admin/uploads", {
    title: "File Upload"
  });
});

admin_router.post("/admin/user/uploads", (req, res) => {
  upload(req, res, err => {
    if (err) {
      res.render("admin/uploads", { msg: err });
    } else {
      if (req.file === undefined) {
        res.render("admin/uploads", {
          title: "File Upload",
          msg: "Error: No file selected!"
        });
      } else {
        res.render("admin/uploads", {
          title: "File Upload",
          msg: "File Uploaded!",
          file: `uploads/${req.file.filename}`
        });
      }
    }
  });
});

module.exports = admin_router;
