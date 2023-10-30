import { Company, Job, db } from ".";

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

const Job = {
  company: (job: Job) => db.companies.get(job.companyId),
};

const Company = {
  jobs: (company: Company) =>
    db.jobs.list().filter((job) => job.companyId === company.id),
};

const resolvers = {
  Query,
  Job,
  Company,
};

export default resolvers;
