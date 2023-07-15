import { type NextFetchEvent, type NextRequest } from "next/server";
import { z } from "zod";
import { extractBody } from "@/lib/extract-body";
import prisma from "@/lib/connect-prisma";

// export const config = {
//   runtime: "edge",
// };

const schema = z.object({
  handle: z.string().max(64).min(1),
});

async function createPageHandler(req: NextRequest, event: NextFetchEvent) {
  let handle = "";
  const body = await extractBody(req);

  try {
    const { handle: pageHandle } = schema.parse(body);
    handle = pageHandle;
  } catch (err) {
    if (err instanceof z.ZodError) {
      console.error(err.issues);
    }
  }

  try {
    await prisma.page.create({
      data: {
        handle,
      },
    });

    return new Response(JSON.stringify({ handle }), {
      status: 200,
    });
  } catch (err) {
    console.error(err);
    return new Response("something went wrong", {
      status: 500,
    });
  }
}

export async function POST(req: NextRequest, event: NextFetchEvent) {
  return createPageHandler(req, event);
}
