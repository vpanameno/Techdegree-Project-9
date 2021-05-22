"use strict";
const { Model, DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");

module.exports = sequelize => {
  class User extends Model {}
  User.init(
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "A First name is required."
          },
          notEmpty: {
            msg: 'Please provide a value for "First Name"'
          }
        }
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "A Last name is required."
          },
          notEmpty: {
            msg: 'Please provide a value for "Last Name"'
          }
        }
      },
      emailAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "An Email Address is required"
          },
          notEmpty: {
            msg: 'Please provide a value for "title"'
          },
          isEmail: {
            msg: "Your email must be in the valid format"
          }
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        set(val) {
          const hashedPassword = bcrypt.hashSync(val, 10);
          this.setDataValue("password", hashedPassword);
        },
        validate: {
          notNull: {
            msg: "A password is required"
          },
          notEmpty: {
            msg: "Please provide a password"
          }
        }
      }
    },
    { sequelize }
  );

  User.associate = models => {
    User.hasMany(models.Course, {
      as: "owner",
      foreignKey: {
        fieldName: "userId",
        allowNull: false
      }
    });
  };
  {
    timestaps: false;
  }

  return User;
};
