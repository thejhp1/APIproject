const express = require("express");

const {
  Event,
  Attendance,
  Group,
  EventImage,
  Venue,
} = require("../../db/models");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const e = require("express");

const router = express.Router();

const validateImageAdd = [
  check("url").exists({ checkFalsy: true }).withMessage("Url is required"),
  check("preview").isBoolean().withMessage("Preview must be a boolean"),
  handleValidationErrors,
];

const validateEventSignup = [
  check("venueId")
    .exists({ checkFalsy: true })
    .custom(async (val, { req }) => {
      const venue = await Venue.findByPk(req.body.venueId);
      if (!venue) {
        throw new Error("Venue couldn't be found");
      }
      return true;
    }),
  check("name")
    .exists({ checkFalsy: true })
    .isLength({ min: 5 })
    .withMessage("Name must be at least 5 characters"),
  check("type")
    .exists({ checkFalsy: true })
    .isIn(["In person", "Online"])
    .withMessage("Type must be Online or In person"),
  check("capacity")
    .exists({ checkFalsy: true })
    .isNumeric()
    .withMessage("Capacity must be an integer"),
  check("price")
    .exists({ checkFalsy: true })
    .isNumeric()
    .withMessage("Price is invalid"),
  check("description")
    .exists({ checkFalsy: true })
    .withMessage("Description is required"),
  check("startDate")
    .exists({ checkFalsy: true })
    .custom((val) => {
      const todayDate = new Date();
      const startDate = new Date(val);
      if (startDate < todayDate) {
        throw new Error("Start date must be in the future");
      }
      return true;
    }),
  check("endDate")
    .exists({ checkFalsy: true })
    .custom((val, { req }) => {
      const endDate = new Date(val);
      const startDate = new Date(req.body.startDate);
      if (endDate < startDate) {
        throw new Error("End date is less than start date");
      }
      return true;
    }),
  handleValidationErrors,
];

router.get("/", async (req, res, next) => {
  const events = await Event.findAll({
    include: [
      {
        model: Attendance,
      },
      {
        model: EventImage,
      },
      {
        model: Group,
        attributes: {
          exclude: [
            "organizerId",
            "about",
            "type",
            "private",
            "createdAt",
            "updatedAt",
          ],
        },
      },
      {
        model: Venue,
        attributes: {
          exclude: [
            "groupId",
            "address",
            "lat",
            "lng",
            "createdAt",
            "updatedAt",
          ],
        },
      },
    ],
    attributes: {
      exclude: ["description", "capacity", "price", "createdAt", "updatedAt"],
    },
  });

  let list = [];
  events.forEach((event) => {
    list.push(event.toJSON());
  });

  list.forEach((event) => {
    let count = 0;
    event.Attendances.forEach((member) => {
      count++;
      event.numAttending = count;
    });
    event.EventImages.forEach((image) => {
      if (image.preview === true) {
        event.previewImage = image.url;
      }
    });
    delete event.EventImages;
    delete event.Attendances;
  });

  res.json({
    Events: list,
  });
});

router.get("/:eventId", async (req, res, next) => {
  const event = await Event.findByPk(req.params.eventId, {
    attributes: {
      exclude: ["updatedAt", "createdAt"],
    },
    include: [
      {
        model: Group,
        attributes: ["id", "name", "private", "city", "state"],
      },
      {
        model: Venue,
        attributes: {
          exclude: ["groupId", "updatedAt", "createdAt"],
        },
      },
      {
        model: EventImage,
        as: "EventImages",
        attributes: {
          exclude: ["eventId", "updatedAt", "createdAt"],
        },
      },
      {
        model: Attendance,
      },
    ],
  });

  if (!event) {
    res.status(404);
    return res.json({
      message: "Event couldn't be found",
    });
  }

  let list = [];
  list.push(event.toJSON());

  list.forEach((item) => {
    let count = 0;
    item.Attendances.forEach((member) => {
      count++;
      item.numAttending = count;
    });
    delete item.Attendances;
  });

  res.json(list[0]);
});

router.post("/:eventId/images", validateImageAdd, async (req, res, next) => {
  let { url, preview } = req.body;

  const event = await Event.findByPk(req.params.eventId);

  if (event) {
    const image = await EventImage.create({
      eventId: Number(req.params.eventId),
      url,
      preview,
    });

    const eventImage = {
      id: image.id,
      url: image.url,
      preview: image.preview,
    };

    res.json(eventImage);
  } else {
    res.status(404);
    res.json({
      message: "Event couldn't be found",
    });
  }
});

router.put("/:eventId", validateEventSignup, async (req, res, next) => {
  const {
    venueId,
    name,
    type,
    capacity,
    price,
    description,
    startDate,
    endDate,
  } = req.body;

  const event = await Event.findByPk(req.params.eventId);

  if (!event) {
    res.status(404);
    return res.json({
      message: "Event couldn't be found",
    });
  }

  if (venueId) {
    event.venueId = venueId
  }
  if (name) {
    event.name = name
  }
  if (type) {
    event.type = type
  }
  if (capacity) {
    event.capacity = capacity
  }
  if (price) {
    event.price = price
  }
  if (description) {
    event.description = description
  }
  if (startDate) {
    event.startDate = startDate
  }
  if (endDate) {
    event.endDate = endDate
  }

  await event.save()

  const updatedEvent = {
    id: event.id,
    groupId: event.groupId,
    venueId: event.venueId,
    name: event.name,
    type: event.type,
    capacity: event.capacity,
    price: event.price,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate
  };

  res.json(updatedEvent)
});

router.delete("/:eventId", async (req, res, next) => {
    
});
module.exports = router;