"use strict";

const auth = require("basic-auth");
const bcrypt = require("bcryptjs");
const { User } = require("../models");

// Middleware to authenticate the request using Basic Authentication.
exports.authenticateUser = async (req, res, next) => {
  let message;
  // Parse the user's credentials from the Authorization header.
  const credentials = auth(req);
  // If the user's credentials are available
  if (credentials) {
    const user = await User.findOne({
      where: { emailAddress: credentials.name }
    });
    if (user) {
      const authenticated = bcrypt.compareSync(credentials.pass, user.password);
      if (authenticated) {
        console.log(
          `Authentication successful for email: ${user.emailAddress}`
        );

        // Store the user on the Request object.
        req.currentUser = user;
      } else {
        message = `Authentication failure for username: ${user.emailAddress}`;
      }
    } else {
      message = `User not found for username: ${credentials.name}`;
    }
  } else {
    message = "Auth header not found";
  }
  if (message) {
    console.warn(message);
    res.status(401).json({ message: "Access Denied" });
  } else {
    next();
  }
};
