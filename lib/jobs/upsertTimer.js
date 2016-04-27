import winston from 'winston';

export default function (job, done) {
  winston.info(`mocking upsertTimer for ${job.data.issue.key}`);
  done();
}
