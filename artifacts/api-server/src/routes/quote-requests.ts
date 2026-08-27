import { Router, type IRouter } from "express";
import multer from "multer";
import { Resend } from "resend";

const router: IRouter = Router();
const upload = multer({ storage: multer.memoryStorage() });
const resend = new Resend(process.env.RESEND_API_KEY);


router.post("/quote-requests", upload.array("photos"), async(req, res) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    address,
    bedrooms,
    bathrooms,
    pets,
    squareFeet,
    serviceType,
    addons,
    additionalNotes,
    estimatedTotal,
  } = req.body;
  const files = (req.files as Express.Multer.File[]) ?? [];

  try {
    const { error } = await resend.emails.send({
        from: "TrueClean KC Website <onboarding@resend.dev>",
        to: process.env.QUOTE_NOTIFICATION_EMAIL!,
        subject: `Free Quote Request from ${firstName} ${lastName}`,
        html: `<p><strong>Name:</strong> ${firstName} ${lastName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Address:</strong> ${address}</p>
            <p><strong>Bedrooms/Bathrooms/SqFt:</strong> ${bedrooms} / ${bathrooms} / ${squareFeet}</p>
            <p><strong>Pets:</strong> ${pets}</p>
            <p><strong>Service Type:</strong> ${serviceType}</p>
            <p><strong>Add-ons:</strong> ${addons || "None"}</p>
            <p><strong>Estimated Total:</strong> from $${estimatedTotal}</p>
            <p><strong>Notes:</strong> ${additionalNotes ?? ""}</p>`,
        attachments: files.map((file) => ({
        filename: file.originalname,
        content: file.buffer,
        })),
    });

    if (error) {
      console.error(error);
      res.status(502).json({ error: "Failed to send quote request. Please try again." });
      return;
    }

    res.status(201).json({ success: true });
    } catch (err) {
    console.error(err);
    res.status(502).json({ error: "Failed to send quote request. Please try again." });
    }
});

export default router;
