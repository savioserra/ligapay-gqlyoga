import { User } from "../../prisma";
import { Resolver } from "../../typings";

export const users: Resolver<User[]> = async (root, args, ctx, info) => {
  return ctx.prisma.query.users({}, info);
};
