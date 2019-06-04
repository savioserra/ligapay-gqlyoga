import { Team, Wallet, Card } from "../../prisma";
import { Resolver } from "../../typings";
import { getUserId } from "../../utils";

const wallet: Resolver<Wallet> = async (user, args, { prisma }, info) => {
  const [w] = await prisma.query.wallets({ where: { user: { id: user.id } } });

  return w;
};

const team: Resolver<Team> = async (user, args, { prisma }, info) => {
  const [t] = await prisma.query.teams({ where: { owner: { id: user.id } } });

  return {...t, id: t.id};
};

const cards: Resolver<Card[]> = async (root, args, ctx, info) => {
  const id = getUserId(ctx);

  return ctx.prisma.query.cards({ where: { user: { id } } });
};

export const User = {
  wallet,
  team,
  cards
};
