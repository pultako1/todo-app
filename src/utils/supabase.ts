import { supabase } from "../lib/supabaseClient";

export async function getAllTodos() {
  const { data, error } = await supabase.from("todolist").select("*");
  if (error) {
    console.error(error);
  }
  return data;
}

export async function addTodo(title: string, time: number) {
  const { error } = await supabase.from("todolist").insert({ title, time });
  console.log(error);
  if (error) {
    console.error(error);
  }
  return error;
}
