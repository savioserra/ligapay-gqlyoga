import { Transaction } from "../../prisma";
import { Resolver } from "../../typings";

import { orderBy } from "lodash";

const transactions: Resolver<Transaction[]> = async (root, args, { prisma }, info) => {
  const incoming = await prisma.query.transactions({ where: { destination: { id: root.id } } });
  const outgoing = await prisma.query.transactions({ where: { origin: { id: root.id } } });

  return orderBy([...incoming, ...outgoing.map(t => ({ ...t, amount: -t.amount }))], "createdAt", "desc");
};

export const Wallet = {
  transactions
};
