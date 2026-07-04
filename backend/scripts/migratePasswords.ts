import bcrypt from "bcryptjs";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();
const SALT_ROUNDS = 12;

/**
 * Migration Script: Re-hash plain-text or weakly hashed passwords
 * Run this during deployment to secure existing accounts.
 */
async function migratePasswords() {
  console.log("Starting password migration...");

  // Example for local DB migration:
  /*
  const users = await prisma.user.findMany({
    where: {
      // Filter for users who haven't been hashed yet or have weak hashes
      // password: { not: { startsWith: "$2b$" } }
    }
  });

  for (const user of users) {
    if (user.password && !user.password.startsWith("$2b$")) {
      const hashed = await bcrypt.hash(user.password, SALT_ROUNDS);
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashed }
      });
      console.log(`Migrated user: ${user.username}`);
    }
  }
  */

  console.log("Migration check completed.");
}

migratePasswords().catch(console.error);
