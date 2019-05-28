import { collectDefaultMetrics, Counter, register } from "prom-client";

collectDefaultMetrics({
  prefix: "ligapay"
});

const requestCounter = new Counter({
  name: "gql_yoga_server_requests",
  help: "Tracks number of requests received.",
  labelNames: ["status"]
});

const errorCounter = new Counter({
  name: "gql_yoga_server_errors",
  help: "Tracks number of errors ocurred.",
  labelNames: ["message"]
});

register.registerMetric(requestCounter);
register.registerMetric(errorCounter);

export default async (resolve, root, args, context, info) => {
  const res = await resolve(root, args, context, info);

  requestCounter.inc({ status: context.response.statusCode });

  if (res instanceof Error) {
    errorCounter.inc({ message: res.message });
    register.metrics();

    throw res;
  }

  return res;
};
