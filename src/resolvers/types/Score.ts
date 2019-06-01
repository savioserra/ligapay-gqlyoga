import { Season } from "../../prisma";
import { Resolver } from "../../typings";

const season: Resolver<Season> = async (score, args, { prisma }) => {
  const { season } = await prisma.query.score({ where: { id: score.id } }, "{ season { id } }");

  return prisma.query.season({ where: { id: season.id } });
};

export const Score = {
  season
};
