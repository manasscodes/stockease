#!/usr/bin/env node

const mongoose = require("mongoose");
require("dotenv").config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

async function testDatabaseConnection() {
  console.log("🔄 Testing MongoDB Connection...\n");

  if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI not found in .env.local file");
    console.log("Please add MONGODB_URI to your .env.local file");
    process.exit(1);
  }

  console.log(
    `📡 Connection String: ${MONGODB_URI.replace(/\/\/.*@/, "//***:***@")}`
  );
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}\n`);

  try {
    // Connect to MongoDB
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      dbName: "tradebeacon",
    });

    console.log("✅ Successfully connected to MongoDB!");

    // Get connection info
    const connectionState = mongoose.connection.readyState;
    const connectionStates = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting",
    };

    console.log(`📊 Connection State: ${connectionStates[connectionState]}`);
    console.log(`🏠 Host: ${mongoose.connection.host}`);
    console.log(`🚪 Port: ${mongoose.connection.port}`);
    console.log(`🗄️  Database: ${mongoose.connection.db.databaseName}\n`);

    // Test database operations
    console.log("🧪 Testing database operations...");

    // Get database stats
    const stats = await mongoose.connection.db.stats();
    console.log(`📈 Collections: ${stats.collections}`);
    console.log(`💾 Data Size: ${(stats.dataSize / 1024).toFixed(2)} KB`);
    console.log(`📋 Index Size: ${(stats.indexSize / 1024).toFixed(2)} KB\n`);

    // List collections
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    console.log("📚 Collections in database:");
    if (collections.length === 0) {
      console.log("   (No collections found)");
    } else {
      collections.forEach((col) => {
        console.log(`   - ${col.name}`);
      });
    }

    console.log("\n✅ All tests passed! Database is working correctly.");
  } catch (error) {
    console.error("❌ Database connection failed:");
    console.error(`   Error: ${error.message}`);

    if (error.message.includes("ENOTFOUND")) {
      console.log("\n💡 Troubleshooting tips:");
      console.log("   - Check if MongoDB is running");
      console.log("   - Verify your connection string");
      console.log("   - Check network connectivity");
    } else if (error.message.includes("authentication failed")) {
      console.log("\n💡 Troubleshooting tips:");
      console.log("   - Check your username and password");
      console.log("   - Verify database permissions");
    }

    process.exit(1);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log("\n🔌 Database connection closed.");
  }
}

// Run the test
testDatabaseConnection().catch(console.error);
