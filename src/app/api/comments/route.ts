import { NextFetchEvent, NextRequest } from "next/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { extractBody } from "@/lib/extract-body";
import prisma from "@/lib/connect-prisma";

export const config = {
  runtime: "edge",
};

const createCommentSchema = z.object({
  page: z.string().max(64).min(1),
  comment: z.string().max(256),
});

async function readCommentsHandler(req: NextRequest, event: NextFetchEvent) {
  const { searchParams } = new URL(req.url);

  const page = searchParams.get("page");

  if (!page) {
    return new Response("page not found", {
      status: 404,
    });
  }

  try {
    const comments = await prisma.comment.findMany({
      where: {
        pageHandle: page,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log({ comments });

    return new Response(JSON.stringify(comments));
  } catch (e) {
    console.error(e);
    return new Response("page not found", {
      status: 404,
    });
  } finally {
    // event.waitUntil(pool.end());
  }
}

// async function createCommentHandler(req: NextRequest, event: NextFetchEvent) {
//   const body = await extractBody(req);

//   const { comment, page } = createCommentSchema.parse(body);

//   const id = uuidv4();

//   const createCommentQuery = sqlstring.format(
//     `INSERT INTO comment (id, page, comment)
//     values(?, ?, ?)`,
//     [id, page, comment]
//   );

//   const pool = new Pool({
//     connectionString: process.env.DATABASE_URL,
//   });

//   try {
//     await pool.query(createCommentQuery);

//     return new Response(JSON.stringify({ id }));
//   } catch (e) {
//     console.error(e);
//     return new Response("Page not found", {
//       status: 404,
//     });
//   } finally {
//     event.waitUntil(pool.end());
//   }
// }

export async function GET(req: NextRequest, event: NextFetchEvent) {
  if (req.method !== "GET") {
    return new Response("invalid method", {
      status: 405,
    });
  }

  return readCommentsHandler(req, event);
}

// export async function POST(req: NextRequest, event: NextFetchEvent) {
//   if (req.method !== "POST") {
//     return new Response("invalid method", {
//       status: 405,
//     });
//   }

//   return createCommentHandler(req, event);
// }
