"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = sequelize => {
  class Course extends Model {}
  Course.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "a title is required"
          },
          notEmpty: {
            msg: "Please provide a value for title"
          }
        }
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: {
            msg: "a description is required"
          },
          notEmpty: {
            msg: "Please provide a value for description"
          }
        }
      },
      estimatedTime: {
        type: DataTypes.STRING,
        allowNull: true
      },
      materialsNeeded: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    { sequelize }
  );

  Course.associate = models => {
    Course.belongsTo(models.User, {
      as: "owner",
      foreignKey: {
        fieldName: "userId",
        allowNull: false
      }
    });
  };
  {
    timestamps: false;
  }
  return Course;
};
