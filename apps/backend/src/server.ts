import serverlessExpress from "@codegenie/serverless-express";
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";
import console from "console";
import cors from "cors";
import { config } from "dotenv";
import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import { booksRouter } from "./controllers/books";
import { chatRouter } from "./controllers/chat";
import { feedbackRouter } from "./controllers/feedback";
import { auth } from "./lib/auth";
config({ path: "../../../.env" });
const storage = multer.memoryStorage();
const upload = multer({ storage });

const app = express();
console.log("process.env.MONGODB_URL", process.env.MONGODB_URL);
app.use(
  cors({
    origin: process.env.VITE_FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  const headers = fromNodeHeaders(req.headers);
  next();
});

app.all("/api/auth/*any", toNodeHandler(auth));

async function main() {
  await mongoose.connect(process.env.MONGODB_URL!);
}

main()
  .then(() => console.log("connected to db"))
  .catch((err) => console.log("Error connecting db:", err));

app.use(express.json());

app.use("/api/books", booksRouter);
app.use("/api/chats", chatRouter);
app.use("/api/feedbacks", feedbackRouter);

app.post("/api/fileToUrl", upload.single("image"), async (req, res) => {
  try {
    let url = null;
    const file = req.file;
    if (!file) throw new Error("File not found");

    const form = new FormData();
    form.append("image", new Blob([file.buffer]), file.originalname);

    const imgRes = await fetch(
      "https://api.imgbb.com/1/upload?key=b10b7ca5ecd048d6a0ed9f9751cebbdc",
      {
        method: "POST",
        body: form,
      }
    );

    const result = await imgRes.json();
    console.log({ result });

    url = result.data.display_url;
    res.json({ ok: true, url });
  } catch (error) {
    console.log(error);

    res.status(500).json(JSON.stringify(error));
  }
});

app.get("/", (req, res) => {
  res.send("Working");
});
const PORT = process.env.PORT;
export default serverlessExpress({ app });

// app.listen(PORT, () => {
//   console.log(`server running on port ${PORT}`);
// });
