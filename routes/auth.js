const express = require("express");
const passport = require("passport");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autoryzacja użytkownika
 */

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Logowanie przez Google OAuth2
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Przekierowanie do Google OAuth2
 */
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    req.session.accessToken = req.user.accessToken;
    req.session.refreshToken = req.user.refreshToken;

    // logout po minucie
    req.session.cookie.maxAge = 60 * 1000;

    res.redirect("/dashboard");
  }
);

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: Wylogowanie użytkownika
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Użytkownik został wylogowany
 */
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.redirect("/");
    });
  });
});

router.use((req, res, next) => {
  if (req.session.cookie.expires < Date.now()) {
    req.logout();
    req.session.destroy();
    res.redirect("/");
  } else {
    next();
  }
});

module.exports = router;
