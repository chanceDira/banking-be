"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const depositController_1 = require("./deposit/depositController");
const router = express_1.default.Router();
router.post('/deposit', depositController_1.DepositMoney);
exports.default = router;
