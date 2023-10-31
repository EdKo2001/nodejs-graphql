import { GraphQLError } from "graphql";

import { Company, Job, User, db } from ".";

interface Root {}

interface Args {
  id: string;
}

const Query = {
  job: (root: Root, args: Args) => db.jobs.get(args.id),
  jobs: () => db.jobs.list(),
  company: (root: Root, args: Args) => db.companies.get(args.id),
  companies: () => db.companies.list(),
};

const Mutation = {
  createJob: (
    root: Root,
    { input }: { input: Job },
    { user }: { user: User }
  ) => {
    // check user auth
    if (!user) {
      // throw Error("Unauthorized");
      throw new GraphQLError("User is not authenticated", {
        extensions: {
          code: "UNAUTHENTICATED",
          http: { status: 401 },
        },
      });
    }
    const jobId = db.jobs.create(input);
    return db.jobs.get(jobId);
  },
};

const Job = {
  company: (job: Job) => db.companies.get(job.companyId),
};

const Company = {
  jobs: (company: Company) =>
    db.jobs.list().filter((job) => job.companyId === company.id),
};

const resolvers = {
  Query,
  Mutation,
  Job,
  Company,
};

export default resolvers;
