const express = require("express");
const router = express.Router();
const Course = require("../models").Course;
const { authenticateUser } = require("../middleware/auth-user");
const User = require("../models").User;

// Handler function to wrap each route.
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      // Forward error to the global error handler
      next(error);
    }
  };
}

// Send a GET request - returns a list of courses
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const courses = await Course.findAll({
      include: [
        {
          model: User,
          as: "owner"
        }
      ]
    });
    if (courses) {
      res.json(courses);
      res.status(200);
    } else {
      res.status(404).json({ message: "Courses not found." });
    }
  })
);

// Send a GET request - returns the course for the provided course ID
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "owner"
        }
      ]
    });
    if (course) {
      res.json(course);
      res.status(200);
    } else {
      res.status(404).json({ message: "Course not found." });
    }
  })
);

//Send a POST request - creates a course, sets the Location header and returns no content

router.post(
  "/",
  authenticateUser,
  asyncHandler(async (req, res) => {
    try {
      const course = await Course.create(req.body);
      res
        .status(201)
        .location("/api/courses/" + course.id)
        .end();
    } catch (error) {
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        const errors = error.errors.map(err => err.message);
        res.status(400).json({ errors });
      } else {
        throw error;
      }
    }
  })
);

// Send a PUT request to /courses/:id to UPDATE (edit) a course
router.put(
  "/:id",
  authenticateUser,
  asyncHandler(async (req, res) => {
    try {
      course = await Course.findByPk(req.params.id);
      await course.update(req.body);
      res.status(204).end();
    } catch (error) {
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        const errors = error.errors.map(err => err.message);
        res.status(400).json({ errors });
      } else {
        throw error;
      }
    }
  })
);

// Send a DELETE request to /courses/:id to DELETE a course
router.delete(
  "/:id",
  authenticateUser,
  asyncHandler(async (req, res, next) => {
    const course = await Course.findByPk(req.params.id);
    if (course) {
      await course.destroy(req.body);
      res.status(204).end();
    } else {
      res.status(404).json({ message: "Course not found." });
    }
  })
);

module.exports = router;
