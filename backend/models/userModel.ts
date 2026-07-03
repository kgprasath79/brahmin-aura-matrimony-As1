// User Model Helper (Abstraction for Enterprise Scalability)
import { UserRole } from "@prisma/client";

export interface UserData {
  id: string;
  mobileNumber: string;
  role: UserRole;
  verified: boolean;
}

// In a real scenario, this would interact with prismaClient
// Example: export const findUserByMobile = (mobile: string) => prisma.user.findUnique({ where: { mobileNumber: mobile } });
