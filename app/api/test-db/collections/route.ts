import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/database/mongoose";

export async function GET(request: NextRequest) {
  try {
    console.log("🔄 Testing database collections...");

    // Connect to database
    const mongoose = await connectToDatabase();

    // List all collections
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();

    const result = {
      success: true,
      message: "Collections retrieved successfully",
      collections: collections.map((col) => ({
        name: col.name,
        type: col.type,
        options: col.options,
      })),
      totalCollections: collections.length,
      timestamp: new Date().toISOString(),
    };

    console.log("✅ Collections test completed successfully");
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("❌ Collections test failed:", error);

    const errorResult = {
      success: false,
      message: "Failed to retrieve collections",
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(errorResult, { status: 500 });
  }
}
