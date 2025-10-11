import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/database/mongoose";

export async function GET(request: NextRequest) {
  try {
    console.log("🔄 Testing database connection...");

    // Connect to database
    const mongoose = await connectToDatabase();

    // Test basic database operations
    const connectionState = mongoose.connection.readyState;
    const connectionStates = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting",
    };

    // Get database stats
    const stats = await mongoose.connection.db.stats();

    const result = {
      success: true,
      message: "Database connection successful!",
      connectionState:
        connectionStates[connectionState as keyof typeof connectionStates],
      database: mongoose.connection.db.databaseName,
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      collections: stats.collections,
      dataSize: stats.dataSize,
      indexSize: stats.indexSize,
      timestamp: new Date().toISOString(),
    };

    console.log("✅ Database test completed successfully");
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("❌ Database test failed:", error);

    const errorResult = {
      success: false,
      message: "Database connection failed",
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(errorResult, { status: 500 });
  }
}
