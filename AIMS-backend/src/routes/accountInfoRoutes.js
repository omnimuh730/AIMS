import express from "express";
import { getAccountInfo, addAccountInfo, removeAccountInfo } from "../controllers/accountInfoController.js";

const router = express.Router();

router.get("/account_info", getAccountInfo);
router.post("/account_info", addAccountInfo);
router.delete("/account_info/:name", removeAccountInfo);

export default router;
