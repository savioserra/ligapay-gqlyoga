import { Prisma } from "./prisma";

export type Resolver<T> = (
  root: any,
  args: any,
  ctx: { prisma: Prisma },
  info: any
) => Promise<T>;
