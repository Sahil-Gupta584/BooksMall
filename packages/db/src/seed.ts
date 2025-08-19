// // import fs from "fs";
// // import mongoose from "mongoose";
// // import { users } from "./mockData";
// // import { Books, Users } from "./modals";

// import mongoose from "mongoose";
// import { Books, Users } from "./modals";

// async function main() {
//   await mongoose.connect(
//     "mongodb+srv://guptas3067:root123@cluster0.6yerxth.mongodb.net/Booksmall"
//   );
// }

// main()
//   .then(() => console.log("connected to db"))
//   .catch((err) => console.log("Error connecting db"));
// async function seedMockData() {
//   const usersInsertRes = await Users.insertMany(users);
//   console.log("usersInsertRes:", usersInsertRes);
//   // const booksInsertRes = await Books.insertMany(books);
// }
// async function update() {
//   const docBefore = await Books.updateMany(
//     { owner: "679f8a2a20397f85bf433820" },
//     { owner: "683c8cc2c9b96d3f2c413741" }
//   );
//   console.log("Before update:", docBefore);

//   // const booksRes = await Books.insertMany(books);
//   // console.log(JSON.stringify(booksRes));
//   // const booksRes = await Users.updateMany(
//   //   {
//   //     image: { $exists: false },
//   //   },
//   //   {
//   //     $set: { image: avatars[Math.floor(Math.random() * 5)] },
//   //   }
//   // );
//   // console.log(JSON.stringify(booksRes));

//   // await Books.updateMany(
//   //   { owner: { $exists: true } },
//   //   { $rename: { owner: "owner" } }
//   // );

//   // const docAfter = await Books.findOne();
//   // console.log("After update:", docAfter);
// }

// update()
//   .then(() => console.log("update Completed"))
//   .catch((err) => console.log("Failed to update Db:", err));
// // seedMockData()
// //   .then(() => console.log("Seed Completed"))
// //   .catch((err) => console.log("Failed to seed Db:", err));
