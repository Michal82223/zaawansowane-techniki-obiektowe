const express = require("express");
const router = express.Router();
const { ensureAuth, ensureGuest } = require("../middleware/auth");

const Visit = require("../models/Visit");

router.get("/", ensureGuest, (req, res) => {
  res.render("home");
});

router.get("/login", ensureGuest, (req, res) => {
  res.render("login", {
    layout: "login",
  });
});

router.get("/dashboard", ensureAuth, async (req, res) => {
  try {
    const visits = await Visit.find({ user: req.user.id })
      .sort({ visitDate: 1 })
      .lean();
    res.render("dashboard", {
      visits,
      user: req.user,
    });
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});

module.exports = router;
