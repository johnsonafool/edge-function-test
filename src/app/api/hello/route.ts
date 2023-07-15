// app/api/route.js 👈🏽
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";




export const config = {
  runtime: "edge",
};

export async function GET(req: NextRequest, event: NextFetchEvent) {
  // Do whatever you want
  return NextResponse.json({ message: "Hello World" }, { status: 200 });
}
