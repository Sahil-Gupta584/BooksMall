import { connectDb } from "@/lib/auth";
import { Books } from "@repo/db";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest, res: NextResponse) {
  try {
    await connectDb()
    const searchParams = req.nextUrl.searchParams;

    const categories = searchParams.get("categories") as string[] | null;
    const conditions = searchParams.get("condition") as string[] | null;
    const max = searchParams.get("max") as number | null;
    const min = searchParams.get("min") as number | null;
    const search = searchParams.get("search");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    return NextResponse.json(books);
  } catch (error) {
    console.log(error);

    return NextResponse.json(JSON.stringify(error));
  }
}
