import { Router, Request, Response } from "express";
// import { Webhook } from "svix"; // Common for Clerk webhooks

const router = Router();

router.post("/user-sync", async (req: Request, res: Response) => {
  const payload = req.body;
  const type = payload.type;

  console.log(`[WEBHOOK] Received ${type} event from Auth Provider.`);

  if (type === "user.created") {
    const { id, email_addresses, first_name } = payload.data;
    // Store only non-sensitive metadata in our local DB
    // await prisma.user.create({ data: { providerId: id, email: email_addresses[0].email_address, memberName: first_name } });
  }

  if (type === "user.deleted") {
    const { id } = payload.data;
    // await prisma.user.delete({ where: { providerId: id } });
  }

  res.json({ received: true });
});

export default router;
