import { TodoBoard } from "@/components/todo-board";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const page = async () => {
  const session = await auth();

  if (!session?.user.id) {
    redirect("/auth/login");
  }
  return <TodoBoard />;
};

export default page;
