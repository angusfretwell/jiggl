import localtunnel from 'localtunnel';
import winston from 'winston';

export default function boot(port, opts) {
  return new Promise((resolve, reject) => {
    localtunnel(port, opts, (err, tunnel) => {
      if (err) {
        winston.error(err);
        return reject(err);
      }

      return resolve(tunnel);
    });
  });
}
