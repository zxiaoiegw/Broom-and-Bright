import { Router, type IRouter } from "express";
import multer, { MulterError } from "multer";
import { Resend } from "resend";

const router: IRouter = Router();
const resend = new Resend(process.env.RESEND_API_KEY);

const MAX_RESUME_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_RESUME_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_RESUME_BYTES },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_RESUME_TYPES.has(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Please upload your resume as a PDF or Word document."));
    }
  },
});

const escapeHtml = (value: unknown): string =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const multiline = (value: unknown): string =>
  escapeHtml(value).replace(/\n/g, "<br/>");

// The resume upload is optional. We run multer inside the handler (rather than
// as route middleware) so an oversized/unsupported file comes back as a clean
// 400 the form can show, instead of an unhandled error.
router.post("/careers-applications", (req, res) => {
  upload.single("resume")(req, res, async (uploadErr) => {
    if (uploadErr) {
      const message =
        uploadErr instanceof MulterError && uploadErr.code === "LIMIT_FILE_SIZE"
          ? "That resume is over the 5MB limit."
          : uploadErr instanceof Error && uploadErr.message
            ? uploadErr.message
            : "We couldn't process that file.";
      res.status(400).json({ error: message });
      return;
    }

    const { fullName, phone, hasVehicle, experience, notes } = req.body ?? {};

    if (!fullName?.trim() || !phone?.trim()) {
      res.status(400).json({ error: "Name and phone are required." });
      return;
    }

    const resume = req.file;
    const vehicleLabel =
      hasVehicle === "yes" ? "Yes" : hasVehicle === "no" ? "No" : "Not answered";

    try {
      const { error } = await resend.emails.send({
        from: "TrueClean KC Website <bookings@mail.truecleankc.com>",
        to: process.env.QUOTE_NOTIFICATION_EMAIL!,
        subject: `Careers application: ${fullName}`,
        html: `<p><strong>Role:</strong> Residential Cleaner</p>
              <p><strong>Name:</strong> ${escapeHtml(fullName)}</p>
              <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
              <p><strong>Reliable vehicle:</strong> ${vehicleLabel}</p>
              <p><strong>Cleaning experience:</strong><br/>${multiline(experience) || "(none provided)"}</p>
              <p><strong>Anything else:</strong><br/>${multiline(notes) || "(none)"}</p>
              <p><strong>Resume:</strong> ${resume ? `attached (${escapeHtml(resume.originalname)})` : "not provided"}</p>`,
        attachments: resume
          ? [{ filename: resume.originalname, content: resume.buffer }]
          : undefined,
      });

      if (error) {
        console.error(error);
        res
          .status(502)
          .json({ error: "Failed to send application. Please try again." });
        return;
      }

      res.status(201).json({ success: true });
    } catch (err) {
      console.error(err);
      res
        .status(502)
        .json({ error: "Failed to send application. Please try again." });
    }
  });
});

export default router;
