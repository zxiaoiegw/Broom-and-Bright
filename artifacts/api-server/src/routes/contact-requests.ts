import { Router, type IRouter } from "express";
import { Resend } from "resend";

const router: IRouter = Router();
const resend = new Resend(process.env.RESEND_API_KEY);

const escapeHtml = (value: unknown): string =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

router.post("/contact-requests", async (req, res) => {
  const { name, email, phone, size, service, message } = req.body ?? {};

  if (!name?.trim() || !email?.trim()) {
    res.status(400).json({ error: "Name and email are required." });
    return;
  }

  try {
    const { error } = await resend.emails.send({
      from: "TrueClean KC Website <bookings@mail.truecleankc.com>",
      to: process.env.QUOTE_NOTIFICATION_EMAIL!,
      replyTo: String(email),
      subject: `Contact form: ${name}${service ? ` – ${service}` : ""}`,
      html: `<p><strong>Name:</strong> ${escapeHtml(name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(email)}</p>
            <p><strong>Phone:</strong> ${escapeHtml(phone) || "N/A"}</p>
            <p><strong>Home size:</strong> ${escapeHtml(size) || "N/A"}</p>
            <p><strong>Service:</strong> ${escapeHtml(service) || "N/A"}</p>
            <p><strong>Message:</strong><br/>${escapeHtml(message).replace(/\n/g, "<br/>") || "(none)"}</p>`,
    });

    if (error) {
      console.error(error);
      res.status(502).json({ error: "Failed to send message. Please try again." });
      return;
    }

    res.status(201).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: "Failed to send message. Please try again." });
  }
});

export default router;
