"use strict";
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}
const { Event } = require("../models");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.validate = true;
    await Event.bulkCreate(
      [
        {
          groupId: 1,
          venueId: null,
          name: "Tennis Group First Meet and Greet",
          type: "In person",
          description: "Come and get to know your fellow tennis mates!",
          capacity: 20,
          price: 0,
          startDate: "07/12/2023",
          endDate: "07/13/2023",
        },
        {
          groupId: 1,
          venueId: 1,
          name: "Tennis Singles",
          type: "In person",
          description: "A friendly match between members of our tennis group.",
          capacity: 20,
          price: 10,
          startDate: "07/13/2023",
          endDate: "07/14/2023",
        },
        {
          groupId: 2,
          venueId: 2,
          name: "Dodgeball Championships",
          type: "In person",
          description:
            "The annual Dodgeball Championships at the park! Remember to sign up early as spots are limited",
          capacity: 50,
          price: 20,
          startDate: "08/12/2023",
          endDate: "08/15/2023",
        },
        {
          groupId: 3,
          venueId: 3,
          name: "Online Intro Safety Meet and Greet",
          type: "Online",
          description: "Get a friendly intro to rafting and kayak safety.",
          capacity: 100,
          price: 0,
          startDate: "07/09/2023",
          endDate: "07/10/2023",
        },
        {
          groupId: 4,
          venueId: 4,
          name: 'Zoom Book "HarryPotter" Event',
          type: "Online",
          description:
            "We will be discussing the first two books! Come with questions.",
          capacity: 99,
          price: 0,
          startDate: "09/14/2023",
          endDate: "09/15/2023",
        },
        {
          groupId: 5,
          venueId: 5,
          name: "Dog Walk in the Park",
          type: "In person",
          description:
            "We will be walking our furry friends around the park in the afternoon.",
          capacity: 10,
          price: 0,
          startDate: "06/29/2023",
          endDate: "06/30/2023",
        },
        {
          groupId: 1,
          venueId: 1,
          name: "Tennis Tournament",
          type: "In person",
          description:
            "Come play against your fellow tennis mates for a secret grand prize!",
          capacity: 20,
          price: 100,
          startDate: "06/28/2023",
          endDate: "06/29/2023",
        },
        {
          groupId: 7,
          venueId: null,
          name: "Demo User Event",
          type: "In person",
          description:
            "This is a demo user's event detail page. Feel free to check out any of the features that we currently have available! Thanks for stopping by.",
          capacity: 20,
          price: 100,
          startDate: "10/28/2023",
          endDate: "11/29/2023",
        },
      ],
      options
    ).catch((err) => {
      throw new Error(err);
    });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Events";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        type: { [Op.in]: ["Online", "In person"] },
      },
      {}
    );
  },
};
