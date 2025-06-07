import express from "express";
import { Feedbacks } from "../db/modals";

const feedbackRouter = express.Router();

feedbackRouter.get("/read", async (req, res) => {
  try {
    const readRes = await Feedbacks.find({})
      .populate("upVotedBy")
      .populate("user");

    res.json(readRes);
  } catch (error) {
    console.log(error);
    res.status(500).json(JSON.stringify(error));
  }
});

feedbackRouter.post("/create", async (req, res) => {
  try {
    const { feedback } = req.body;
    if (!feedback) throw new Error("Invalid payload");
    const createRes = await Feedbacks.create(feedback);

    res.json({ ok: true, res: createRes });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: (error as Error).message });
  }
});

feedbackRouter.post("/upvote", async (req, res) => {
  try {
    const { feedbackId, userId } = req.body;
    if (!feedbackId || !userId) throw new Error("Invalid payload");

    const upvoteRes = await Feedbacks.updateOne(
      { _id: feedbackId },
      { $addToSet: { upVotedBy: userId } }
    );

    res.json({ ok: true, res: upvoteRes });
  } catch (error) {
    console.log(error);
    res.status(500).json(JSON.stringify(error));
  }
});

feedbackRouter.post("/devote", async (req, res) => {
  try {
    const { feedbackId, userId } = req.body;
    if (!feedbackId || !userId) throw new Error("Invalid payload");

    const upvoteRes = await Feedbacks.updateOne(
      { _id: feedbackId },
      { $pull: { upVotedBy: userId } }
    );

    res.json({ ok: true, res: upvoteRes });
  } catch (error) {
    console.log(error);
    res.status(500).json(JSON.stringify(error));
  }
});

export { feedbackRouter };
