import sharp from "sharp";
import { NextResponse } from "next/server";

export const POST = async (req) => {
    const headers = new Headers();
    headers.append("Access-Control-Allow-Origin", "http://127.0.0.1:3004"); // Allow your frontend's origin
    headers.append("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    headers.append("Access-Control-Allow-Headers", "Content-Type");
    try {
      
        const formData = await req.formData();
        // console.log("FormData received:", formData));
        console.log("FormData received:", formData);

        const imageFile = formData.get("image"); // Expecting a file upload
        const x = parseInt(formData.get("x"), 10);
        const y = parseInt(formData.get("y"), 10);
        const width = parseInt(formData.get("width"), 10);
        const height = parseInt(formData.get("height"), 10);
        const scaleFactor = parseInt(formData.get("scaleFactor"), 10) || 1;

        if (!imageFile || typeof x !== "number" || typeof y !== "number" || !width || !height) {
            return NextResponse.json({ error: "Invalid input" }, { status: 400 });
        }

        const arrayBuffer = await imageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const croppedImageBuffer = await sharp(buffer)
            .extract({ left: x, top: y, width, height })
            .resize(width * scaleFactor, height * scaleFactor, { fit: "cover" })
            .toFormat("png", { quality: 100 })
            .toBuffer();
        // console.log('croppedImageBuffer', croppedImageBuffer)

        const blob = new Blob([croppedImageBuffer], { type: "image/png" });
        const form = new FormData();
        form.append("image", blob, `page.png`);

        const res = await fetch("https://api.imgbb.com/1/upload?key=b10b7ca5ecd048d6a0ed9f9751cebbdc", {
            method: "POST",
            body: form,
        });
        const result = await res.json();
        console.log('result', result.data.display_url)
        return NextResponse.json({ clipUrl: result.data.display_url,status: 200 });


    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Failed to crop image" }, { status: 500 });
    }
};
