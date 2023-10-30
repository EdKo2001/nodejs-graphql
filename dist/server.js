"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const utils_1 = require("./utils");
const db_1 = __importDefault(require("./db"));
const lib_1 = require("./lib");
const port = lib_1.env.PORT || 9000;
const jwtSecret = lib_1.env.JWT_SECRET;
const app = (0, express_1.default)();
app.use((0, cors_1.default)(), body_parser_1.default.json());
app.post("/login", (req, res) => {
    const { email, password } = req.body;
    const user = db_1.default.users.list().find((user) => user.email === email);
    if (!(user && user.password === password)) {
        res.sendStatus(401);
        return;
    }
    const token = jsonwebtoken_1.default.sign({ userId: user.id }, jwtSecret);
    res.send({ token });
});
// Protect routes that require authentication
app.get("/protected", utils_1.checkAuth, (req, res) => {
    // Only accessible with a valid JWT
    res.send("Protected route - JWT authentication successful!");
});
app.listen(port, () => console.info(`Server started on port ${port}`));
