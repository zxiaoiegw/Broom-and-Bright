import { Router, type IRouter } from "express";
import multer from "multer";
import { Resend } from "resend";

const router: IRouter = Router();
const upload = multer({ storage: multer.memoryStorage() });
const resend = new Resend(process.env.RESEND_API_KEY);


router.post("/quote-requests", upload.array("photos"), async(req, res) => {
  const {
    serviceMode = "standard",
    firstName,
    lastName,
    email,
    phone,
    address,
    bedrooms,
    bathrooms,
    halfBaths,
    squareFeet,
    frequency,
    serviceType,
    addons,
    hours,
    additionalNotes,
    estimatedTotal,
    preferredContact,
  } = req.body;
  const files = (req.files as Express.Multer.File[]) ?? [];

  const CONTACT_METHOD_LABELS: Record<string, string> = {
    email: "Email",
    message: "Text Message",
    phoneCall: "Phone Call",
  };
  const preferredContactLabel = CONTACT_METHOD_LABELS[preferredContact] ?? preferredContact;

  const isHourly = serviceMode === "hourly";

  const contactBlock = `<p><strong>Name:</strong> ${firstName} ${lastName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Preferred Contact Method:</strong> ${preferredContactLabel}</p>
            <p><strong>Address:</strong> ${address}</p>`;

  const detailsBlock = isHourly
    ? `<p><strong>Service:</strong> Hourly service</p>
            <p><strong>Man hours requested:</strong> ${hours}</p>
            <p><strong>Estimated Total:</strong> $${estimatedTotal}</p>
            <p><strong>Notes:</strong> ${additionalNotes ?? ""}</p>`
    : `<p><strong>Service:</strong> Standard package</p>
            <p><strong>Bedrooms/Bathrooms/SqFt:</strong> ${bedrooms} / ${bathrooms} / ${squareFeet}</p>
            <p><strong>Half Baths:</strong> ${halfBaths}</p>
            <p><strong>Frequency:</strong> ${frequency}</p>
            <p><strong>Service Type:</strong> ${serviceType}</p>
            <p><strong>Add-ons:</strong> ${addons || "None"}</p>
            <p><strong>Estimated Total:</strong> from $${estimatedTotal}</p>
            <p><strong>Notes:</strong> ${additionalNotes ?? ""}</p>`;

  try {
    const { error } = await resend.emails.send({
        from: "TrueClean KC Website <bookings@mail.truecleankc.com>",
        to: process.env.QUOTE_NOTIFICATION_EMAIL!,
        subject: `${isHourly ? "Hourly" : "Free"} Quote Request from ${firstName} ${lastName}`,
        html: `${contactBlock}${detailsBlock}`,
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
