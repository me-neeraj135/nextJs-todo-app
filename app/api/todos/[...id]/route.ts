

import clientPromise from "@/lib/mongodb";
import { NextResponse, NextRequest } from "next/server";
import { ObjectId } from "mongodb";
import type { Todo } from "@/types/todo";

type NextRouteContext =
  | { params: Record<string, string | string[] | undefined> }
  | { params: Promise<Record<string, string | string[] | undefined>> };

export async function DELETE(request: NextRequest, context: NextRouteContext) {
    const params = await context.params;
    const { id } = params;
    const client = await clientPromise;
    const db = client.db();
            const todos = db.collection("todos");
    const todoId = Array.isArray(id) ? id[0] : typeof id === 'string' ? id : undefined;
    if (!todoId || !ObjectId.isValid(todoId)) {
        return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }
    await todos.deleteOne({ _id: new ObjectId(todoId) });
    return NextResponse.json({ message: "Todo deleted successfully" }, { status: 200 });
}

export async function PUT(request: NextRequest, context: NextRouteContext) {
    const params = await context.params;
    const { id } = params;
    const { title, completed } = await request.json();
        const client = await clientPromise;
        const db = client.db();
            const todos = db.collection("todos");
    const todoId = Array.isArray(id) ? id[0] : typeof id === 'string' ? id : undefined;
    if (!todoId || !ObjectId.isValid(todoId)) {
        return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }
    const update: Partial<Todo> = {};
    if (typeof title !== "undefined") update.title = title;
    if (typeof completed !== "undefined") update.completed = completed;
    await todos.updateOne({ _id: new ObjectId(todoId) }, { $set: update });
    const updated = await todos.findOne({ _id: new ObjectId(todoId) });
    const normalized = { ...updated, _id: updated?._id?.toString() };
    return NextResponse.json(normalized, { status: 200 });
}