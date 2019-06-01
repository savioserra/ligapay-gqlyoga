import { Team, Wallet } from "../../prisma";
import { Resolver } from "../../typings";

const wallet: Resolver<Wallet> = async (user, args, { prisma }, info) => {
  const [w] = await prisma.query.wallets({ where: { user: { id: user.id } } });

  return w;
};

const team: Resolver<Team> = async (user, args, { prisma }, info) => {
  const [t] = await prisma.query.teams({ where: { owner: { id: user.id } } });

  return {...t, id: t.id};
};

export const User = {
  wallet,
  team
};
