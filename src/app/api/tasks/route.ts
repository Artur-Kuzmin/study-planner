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
    newTask.id = data.tasks.length + 1;

    data.tasks.push(newTask);
    writeFileSync(dataFilePath, JSON.stringify(data, null, 2));

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error("Error saving task:", error);
    return NextResponse.json({ error: "Failed to save task" }, { status: 500 });
  }
}