const Router = require("express").Router();
const Models = require("../Models/tables");

Router.get("/:pid", async (req, res, next) => {
  try {
    const result = await Models.post.findOne({
      include: [
        {
          model: Models.user,
          attributes: ["userName"]
        }
      ],
      where: { id: req.params.pid },
      attributes: ["id", "title", "content", "updatedAt"]
    });
    result && res.status(200).json({ success: true, response: result });
  } catch (error) {
    next(error);
  }
});

Router.post("/", async (req, res, next) => {
  try {
    const result = await Models.post.create(
      {
        userId: req.user.id,
        title: req.body.title,
        content: [...req.body.content]
      }
      // { include: [Models.story] }
    );
    result &&
      res.status(201).json({
        success: true,
        response: {
          id: result.dataValues.id
        }
      });
  } catch (error) {
    next(error);
  }
});

Router.patch("/", async (req, res, next) => {
  try {
    const result = await Models.post.update(
      {
        title: req.body.title,
        content: [...req.body.content]
      },
      {
        where: { id: req.body.pid }
      }
    );
    result &&
      res.status(201).json({
        success: true
      });
  } catch (error) {
    next(error);
  }
});

Router.delete("/", (req, res, next) => {});

module.exports = Router;
