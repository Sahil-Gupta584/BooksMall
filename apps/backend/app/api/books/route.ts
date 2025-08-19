import { Books, connectDb } from "@repo/db";

import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest) {
  try {
    await connectDb();
    const searchParams = req.nextUrl.searchParams;

    const categories = searchParams.getAll("categories") as string[] | null;
    const conditions = searchParams.getAll("condition[]") as string[] | null;
    const max = Number(searchParams.get("max")) as number | null;
    const min = Number(searchParams.get("min")) as number | null;
    const search = searchParams.get("search");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: mongoose.RootFilterQuery<any> = {};
    if (min || max) {
      filter.price = {};
      if (min) filter.price.$gte = min || null;
      if (max) {
        console.log({ max });

        filter.price.$lte = max || null;
      }
    }

    if (categories && categories.length > 0) {
      filter.categories = {
        $in: Array.isArray(categories) ? categories : [categories],
      };
    }
    console.log("conditions", conditions);

    if (conditions && conditions.length > 0) {
      filter.condition = {
        $in: Array.isArray(conditions) ? conditions : [conditions],
      };
    }
    if (search) {
      const regex = new RegExp(search as string, "i");
      filter.$or = [{ title: regex }, { description: regex }];
    }
    console.log("filter", filter);

    const books = await Books.find(filter).populate("owner");
    return NextResponse.json(books);
  } catch (error) {
    console.log(error);

    return NextResponse.json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
