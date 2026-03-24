import { readFileSync, writeFileSync } from "fs";
import { NextResponse } from "next/server";
import path from "path";

const dataFilePath = path.join(process.cwd(), "data", "tasks.json");

export async function GET() {
  try {
    const fileContents = readFileSync(dataFilePath, "utf-8");
    const data = JSON.parse(fileContents);
    return NextResponse.json(data.tasks);
  } catch (error) {
    console.error("Error reading tasks:", error);
    return NextResponse.json({ error: "Failed to read tasks" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const fileContents = readFileSync(dataFilePath, "utf-8");
    const data = JSON.parse(fileContents);

    const newTask = await request.json();
    newTask.id = data.tasks.length > 0 ? Math.max(...data.tasks.map((t: any) => t.id)) + 1 : 1;

    data.tasks.push(newTask);
    writeFileSync(dataFilePath, JSON.stringify(data, null, 2));

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error("Error saving task:", error);
    return NextResponse.json({ error: "Failed to save task" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get("id");
    
    if (!idParam) {
      return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
    }

    const taskId = Number(idParam);
    const fileContents = readFileSync(dataFilePath, "utf-8");
    const data = JSON.parse(fileContents);
    
    const initialLength = data.tasks.length;
    // Filter out the task by testing both the number form and string form of the ID for safety
    data.tasks = data.tasks.filter((task: any) => task.id !== taskId && String(task.id) !== idParam);
    
    if (data.tasks.length === initialLength) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }
    
    writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
    
    return NextResponse.json({ message: "Task deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, completed } = await request.json();
    
    if (id === undefined || completed === undefined) {
      return NextResponse.json({ error: "Task ID and completed status are required" }, { status: 400 });
    }

    const fileContents = readFileSync(dataFilePath, "utf-8");
    const data = JSON.parse(fileContents);
    
    const taskIndex = data.tasks.findIndex((task: any) => task.id === id || String(task.id) === String(id));
    
    if (taskIndex === -1) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }
    
    data.tasks[taskIndex].completed = completed;
    writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
    
    return NextResponse.json(data.tasks[taskIndex], { status: 200 });
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}