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

export async function PATCH(
  request: NextRequest,
  {params}: {params: Promise<{id: string}>},
) {
  try {
    const {id} = await params;
    const {title, description, completed} = await request.json();

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Todo id is required",
        },
        {status: 400},
      );
    }

    const updatedTodo = await prisma.todo.update({
      where: {
        id,
      },
      data: {
        title,
        description,
        completed,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: updatedTodo,
      },
      {status: 200},
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error &&
          error.message.includes("Record to update not found")
            ? "Todo not found"
            : error instanceof Error
              ? error.message
              : "Internal Server Error",
      },
      {
        status:
          error instanceof Error &&
          error.message.includes("Record to update not found")
            ? 404
            : 500,
      },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  {params}: {params: Promise<{id: string}>},
) {
  try {
    const {id} = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Todo id is required",
        },
        {status: 400},
      );
    }

    await prisma.todo.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Todo deleted successfully",
      },
      {status: 200},
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error &&
          error.message.includes("Record to delete does not exist")
            ? "Todo not found"
            : error instanceof Error
              ? error.message
              : "Internal Server Error",
      },
      {
        status:
          error instanceof Error &&
          error.message.includes("Record to delete does not exist")
            ? 404
            : 500,
      },
    );
  }
}
