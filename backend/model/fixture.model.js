// backend/models/fixture.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db/connection');

const Fixture = sequelize.define('Fixture', {
  FIXTURE_ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,   // ✅ Auto increment enabled
  },
  FIXTURE_UNIQUE_IDENTIFIER: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  START_DATE: DataTypes.DATE,
  END_DATE: DataTypes.DATE,
  FIXTURE_DESCR: DataTypes.STRING,
  FIXTURE_TYPE: DataTypes.STRING,
  FIXTURE_CODE: DataTypes.STRING,
  FIXTURE_STATUS: DataTypes.STRING,
  FIXTURE_DIMENSION_UNIT: DataTypes.STRING,
  FIXTURE_DIMENTION_HEIGHT: DataTypes.FLOAT,
  FIXTURE_DIMENTION_WIDTH: DataTypes.FLOAT,
  FIXTURE_DIMENTION_DEPTH: DataTypes.FLOAT,
  FIXTURE_FLOOR_TO_SHELF_HEIGHT: DataTypes.FLOAT,
  FIXTURE_CAPACITY_UNITS: DataTypes.FLOAT,
  FIXTURE_AVAIL_FOR_RENT: DataTypes.BOOLEAN,
  FIXTURE_LOCATION: DataTypes.STRING,
  FIXTURE_CATEGORY: DataTypes.STRING
}, {
  tableName: 'fixtures',
  timestamps: false
});

module.exports = Fixture;
