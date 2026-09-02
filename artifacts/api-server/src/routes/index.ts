import { Router, type IRouter } from "express";
import healthRouter from "./health";
import quoteRequestRouter from "./quote-requests";
import contactRequestRouter from "./contact-requests";
import staffAuthRouter from "./staff-auth";
import staffRouter from "./staff";
import availabilityRouter from "./availability";
import bookingsRouter from "./bookings";
import calendarFeedRouter from "./calendar-feed";
import cronRouter from "./cron";

const router: IRouter = Router();

router.use(healthRouter);

router.use(quoteRequestRouter);

router.use(contactRequestRouter);

router.use(staffAuthRouter);

router.use(staffRouter);

router.use(availabilityRouter);

router.use(bookingsRouter);

router.use(calendarFeedRouter);

router.use(cronRouter);

export default router;
