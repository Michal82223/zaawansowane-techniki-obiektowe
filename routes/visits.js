const express = require("express");
const router = express.Router();
const { ensureAuth } = require("../middleware/auth");

const Visit = require("../models/Visit");

router.get("/add", ensureAuth, (req, res) => {
  res.render("visits/add");
});

/**
 * @swagger
 * /visits:
 *   post:
 *     summary: Dodanie nowej wizyty
 *     tags: [Visits]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               visitDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Wizyta została dodana
 */
router.post("/", ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id;
    await Visit.create(req.body);
    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
    res.render("error/500");
  }
});

// @desc    Show all visits
// @route   GET /visits

/**
 * @swagger
 * tags:
 *   name: Visits
 *   description: Zarządzanie wizytami
 */

/**
 * @swagger
 * /visits:
 *   get:
 *     summary: Pobranie wszystkich wizyt użytkownika
 *     tags: [Visits]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista wizyt użytkownika
 */
router.get("/", ensureAuth, async (req, res) => {
  try {
    const visits = await Visit.find()
      .populate("user")
      .sort({ visitDate: 1 })
      .lean();
    res.render("visits/index", {
      visits,
    });
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});

router.get("/edit/:id", ensureAuth, async (req, res) => {
  try {
    const visit = await Visit.findOne({
      _id: req.params.id,
    }).lean();

    if (!visit) {
      return res.render("error/404");
    }

    if (visit.user != req.user.id) {
      res.redirect("/visits");
    } else {
      res.render("visits/edit", {
        visit,
      });
    }
  } catch (err) {
    console.error(err);
    return res.render("error/500");
  }
});

/**
 * @swagger
 * /visits/{id}:
 *   put:
 *     summary: Edycja wizyty
 *     tags: [Visits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID wizyty
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               visitDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Wizyta została zaktualizowana
 */
router.put("/:id", ensureAuth, async (req, res) => {
  try {
    let visit = await Visit.findById(req.params.id).lean();

    if (!visit) {
      return res.render("error/404");
    }

    if (visit.user != req.user.id) {
      res.redirect("/visits");
    } else {
      visit = await Visit.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      });

      res.redirect("/dashboard");
    }
  } catch (err) {
    console.error(err);
    return res.render("error/500");
  }
});

/**
 * @swagger
 * /visits/{id}:
 *   delete:
 *     summary: Usunięcie wizyty
 *     tags: [Visits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID wizyty
 *     responses:
 *       200:
 *         description: Wizyta została usunięta
 */
router.delete("/:id", ensureAuth, async (req, res) => {
  try {
    await Visit.findByIdAndDelete({ _id: req.params.id });
    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    return res.render("error/500");
  }
});

module.exports = router;
