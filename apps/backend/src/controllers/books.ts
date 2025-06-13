import console from "console";
import express from "express";
import mongoose from "mongoose";
import { Books } from "../db/modals";

const booksRouter = express.Router();

booksRouter.get("/", async (req, res) => {
  try {
    const { min, max, search } = req.query;
    // const {}
    const conditions = req.query["condition[]"];
    const categories = req.query["categories[]"];
    const filter: mongoose.RootFilterQuery<any> = {};
    if (min || max) {
      filter.price = {};
      if (min) filter.price.$gte = Number(min) || null;
      if (max) filter.price.$lte = Number(max) || null;
    }

    if (categories)
      filter.categories = {
        $in: Array.isArray(categories) ? categories : [categories],
      };

    if (conditions)
      filter.condition = {
        $in: Array.isArray(conditions) ? conditions : [conditions],
      };

    if (search) {
      const regex = new RegExp(search as string, "i");
      filter.$or = [{ title: regex }, { description: regex }];
    }

    const books = await Books.find(filter).populate("owner");
    res.json(books);
  } catch (error) {
    console.log(error);

    res.status(500).json(JSON.stringify(error));
  }
});

booksRouter.post("/create", async (req, res) => {
  try {
    const { bookData } = req.body;
    const book = await Books.create(bookData);
    res.json({ ok: true, book });
  } catch (error) {
    res.status(500).json(JSON.stringify(error));
  }
});
booksRouter.post("/update", async (req, res) => {
  try {
    const { bookData } = req.body;
    if (req.payload && req.payload.user._id !== bookData.owner) {
      res.status(403).json({ error: "Invalid permission" });
      return;
    }
    const book = await Books.updateOne({ _id: bookData._id }, bookData);
    res.json({ ok: true, book });
  } catch (error) {
    res.status(500).json(JSON.stringify(error));
  }
});
booksRouter.post("/delete", async (req, res) => {
  try {
    const { bookId } = req.body;
    const book = await Books.findOne({ _id: bookId });
    if (req.payload && req.payload.user._id !== book.owner) {
      res.status(403).json({ error: "Invalid permission" });
      return;
    }
    const deleteRes = await Books.deleteOne({ _id: bookId });
    res.json({ ok: true, book });
  } catch (error) {
    res.status(500).json(JSON.stringify(error));
  }
});

booksRouter.get("/:bookId", async (req, res) => {
  const { bookId } = req.params;
  const book = await Books.find({ _id: bookId }).populate("owner");
  res.json(book[0]);
});

booksRouter.post("/myBooks", async (req, res) => {
  const { userId } = req.body;
  if (!userId) throw new Error("userId is required!");

  const book = await Books.find({ owner: userId });
  res.json(book);
});

export { booksRouter };
