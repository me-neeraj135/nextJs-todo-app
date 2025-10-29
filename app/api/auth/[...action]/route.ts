import { getDb } from "@/lib/mongodb";
import { NextResponse, NextRequest } from "next/server";
import { User } from "@/types/user";



// Validate that we have a supported action
function isValidAction(lastAction: string): lastAction is 'register' | 'login' {
  return ['register', 'login'].includes(lastAction);
}

export async function POST(request: NextRequest, context: { params: Promise<{ action: string[] }> }) {  try {
    // Get and validate the action
      const { action } = await context.params;
    const lastAction = action[action.length - 1];

    if (!isValidAction(lastAction)) {
      
      return NextResponse.json({
        message: `Invalid action: ${lastAction}`,
        code: "INVALID_ACTION"
      }, { status: 400 });
    }

   
 

    // Get request body
    const body = await request.json();
    const { name, email, password } = body;

    // Connect to database
    const db = await getDb();
    const users = db.collection<User>("users");

    

  
    // Basic validation for all requests
    if (!email || !password) {
      return NextResponse.json({
        message: "Email and password are required",
        code: "MISSING_FIELDS"
      }, { status: 400 });
    }

    // Handle different actions
    switch (lastAction) {
      case "register": {
        // Additional register-specific validation
        if (!name) {
          return NextResponse.json({
            message: "Name is required for registration",
            code: "MISSING_NAME"
          }, { status: 400 });
        }

        // Check for existing user
        const existingUser = await users.findOne({ email });
        if (existingUser) {
          
          return NextResponse.json({
            message: "Email address is already registered",
            code: "EMAIL_EXISTS"
          }, { status: 400 });
        }

        // Validate password length
        if (password.length < 6) {
          return NextResponse.json({
            message: "Password must be at least 6 characters long",
            code: "INVALID_PASSWORD"
          }, { status: 400 });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return NextResponse.json({
            message: "Please enter a valid email address",
            code: "INVALID_EMAIL"
          }, { status: 400 });
        }

        // Create new user
        const now = new Date();
        const newUser: User = {
          name,
          email,
          password,
          createdAt: now,
          updatedAt: now
        };

        const result = await users.insertOne(newUser);
        

        return NextResponse.json({
          message: "Registration successful",
          userId: result.insertedId
        }, { status: 201 });
      }

      case "login": {
        const user = await users.findOne({ email, password });
        if (!user) {
          
          return NextResponse.json({
            message: "Invalid credentials",
            code: "INVALID_CREDENTIALS"
          }, { status: 401 });
        }

        // Remove password from response
        const { password: _, ...safeUser } = user;
   

        return NextResponse.json({
          message: "Login successful",
          user: safeUser
        }, { status: 200 });
      }

      default:
        
        return NextResponse.json({
          message: `Invalid action: ${action}`,
          code: "INVALID_ACTION"
        }, { status: 400 });
    }
  } catch (error) {
   
    return NextResponse.json({
      message: "An unexpected error occurred",
      code: "SERVER_ERROR"
    }, { status: 500 });
  }

}
