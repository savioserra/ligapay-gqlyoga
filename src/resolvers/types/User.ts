import { Team, Wallet } from "../../prisma";
import { Resolver } from "../../typings";

const wallet: Resolver<Wallet> = async (root, args, { prisma }, info) => {
  const [w] = await prisma.query.wallets({ where: { user: { id: root.id } } });

  return w;
};

const team: Resolver<Team> = async (root, args, { prisma }, info) => {
  const [t] = await prisma.query.teams({ where: { owner: { id: root.id } } });

  return t;
};

export const User = {
  wallet,
  team
};
