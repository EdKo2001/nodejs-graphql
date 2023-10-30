"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const notarealdb_1 = require("notarealdb");
const store = new notarealdb_1.DataStore("./data");
const collections = {
    companies: store.collection("companies"),
    jobs: store.collection("jobs"),
    users: store.collection("users"),
};
exports.default = collections;
