import {NextRequest, NextResponse} from "next/server";
import {prisma} from "@/lib/db";

export async function GET() {
  try {
    const todos = await prisma.todo.findMany();

    return NextResponse.json(
      {
        success: true,
        data: todos,
      },
      {status: 200},
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Internal Server Error",
      },
      {status: 500},
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const {title, description, completed} = await request.json();

    if (!title || !description) {
      return NextResponse.json(
        {
          success: false,
          message: "Title and description are required",
        },
        {status: 400},
      );
    }

    const todo = await prisma.todo.create({
      data: {
        title,
        description,
        completed,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Todo created successfully",
        data: todo,
      },
      {status: 201},
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Internal Server Error",
      },
      {status: 500},
    );
  }
}
