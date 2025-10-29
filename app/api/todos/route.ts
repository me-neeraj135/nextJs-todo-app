import clientPromise from "@/lib/mongodb";
import { NextResponse, NextRequest } from "next/server";
import { ObjectId } from "mongodb";
// Server-side representation of a Todo (Mongo _id is ObjectId)
type DbTodo = {
  _id?: ObjectId;
  userEmail: string;
  title: string;
  completed: boolean;
};

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get("email");
    const client = await clientPromise;
    const db = client.db();
  const todos = db.collection<DbTodo>("todos");

    const query = email ? { userEmail: email } : {};
  const items = await todos.find(query).toArray();

  // normalize _id to string for client usage
  const normalized = items.map((t) => ({ ...t, _id: t._id ? t._id.toString() : undefined }));
    return NextResponse.json(normalized, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Failed to fetch todos" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, userEmail } = body as { title?: string; userEmail?: string };
    if (!title || !userEmail) {
      return NextResponse.json({ message: "Missing title or userEmail" }, { status: 400 });
    }
    const client = await clientPromise;
    const db = client.db();
  const todos = db.collection<DbTodo>("todos");

    const doc = { title, userEmail, completed: false };
  const result = await todos.insertOne(doc);
  const inserted = await todos.findOne({ _id: result.insertedId });
  const normalized = { ...inserted, _id: inserted?._id?.toString() };
    return NextResponse.json(normalized, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Failed to create todo" }, { status: 500 });
  }
}
