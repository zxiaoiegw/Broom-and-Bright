import { Router, type IRouter } from "express";
import healthRouter from "./health";
import quoteRequestRouter from "./quote-requests";
import contactRequestRouter from "./contact-requests";

const router: IRouter = Router();

router.use(healthRouter);

router.use(quoteRequestRouter);

router.use(contactRequestRouter);

export default router;
