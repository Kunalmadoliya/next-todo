export type Todo = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  updateAt: string;
};

type ApiListResponse = {
  success: boolean;
  data?: Todo[];
  message?: string;
};

type ApiTodoResponse = {
  success: boolean;
  data?: Todo;
  message?: string;
};

type ApiMessageResponse = {
  success: boolean;
  message?: string;
};

async function parseJson<T>(res: Response): Promise<T> {
  const body = (await res.json()) as T & {message?: string};
  if (!res.ok) {
    throw new Error(
      "message" in body && typeof body.message === "string"
        ? body.message
        : "Request failed",
    );
  }
  return body;
}

export async function fetchTodos(): Promise<Todo[]> {
  const res = await fetch("/api/todos");
  const body = await parseJson<ApiListResponse>(res);
  return body.data ?? [];
}

export async function createTodo(input: {
  title: string;
  description: string;
}): Promise<Todo> {
  const res = await fetch("/api/todos", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({...input, completed: false}),
  });
  const body = await parseJson<ApiTodoResponse>(res);
  if (!body.data) throw new Error("No todo returned");
  return body.data;
}

export async function updateTodo(
  id: string,
  patch: Partial<Pick<Todo, "title" | "description" | "completed">>,
): Promise<Todo> {
  const res = await fetch(`/api/todos/${id}`, {
    method: "PATCH",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(patch),
  });
  const body = await parseJson<ApiTodoResponse>(res);
  if (!body.data) throw new Error("No todo returned");
  return body.data;
}

export async function deleteTodo(id: string): Promise<void> {
  const res = await fetch(`/api/todos/${id}`, {method: "DELETE"});
  await parseJson<ApiMessageResponse>(res);
}
