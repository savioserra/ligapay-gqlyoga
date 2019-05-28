import { Score, User, TeamEnrollment } from "../../prisma";
import { Resolver } from "../../typings";

const scores: Resolver<Score[]> = async (root, args, { prisma }, info) => {
  const scores = await prisma.query.scores({ where: { team: { id: root.id } } });

  return scores;
};

const owner: Resolver<User> = async (root, args, { prisma }, info) => {
  const [user] = await prisma.query.users({ where: { team: { id: root.id } } });

  return user;
};

const enrollments: Resolver<TeamEnrollment[]> = async (root, args, { prisma }, info) => {
  const enrollments = await prisma.query.teamEnrollments({ where: { team: { id: root.id } } });

  return enrollments;
};

export const Team = {
  scores,
  owner,
  enrollments
};
