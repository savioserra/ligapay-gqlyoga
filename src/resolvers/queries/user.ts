import { User } from "../../prisma";
import { Resolver } from "../../typings";
import { getUserId } from "../../utils";

const users: Resolver<User[]> = async (root, args, ctx, info) => {
  return ctx.prisma.query.users({}, info);
};

const me: Resolver<User> = async (root, args, ctx, info) => {
  const id = getUserId(ctx);

  return ctx.prisma.query.user({ where: { id } });
};

export default {
  users,
  me
};
