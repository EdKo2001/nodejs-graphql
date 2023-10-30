import { DataStore } from "notarealdb";

export interface Company {
  id: string;
  name: string;
  description: string;
}

export interface Job {
  id: string;
  companyId: string;
  title: string;
  description: string;
}

export interface User {
  id: string;
  email: string;
  password: string;
  companyId: string;
}

const store = new DataStore("./data");

const collections = {
  companies: store.collection<Company>("companies"),
  jobs: store.collection<Job>("jobs"),
  users: store.collection<User>("users"),
};

export default collections;
