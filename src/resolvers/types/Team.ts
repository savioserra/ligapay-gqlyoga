import { Score, User, TeamEnrollment } from "../../prisma";
import { Resolver } from "../../typings";

const scores: Resolver<Score[]> = async (team, args, { prisma }, info) => {
  const scores = await prisma.query.scores({ where: { team: { id: team.id } } });

  return scores;
};

const owner: Resolver<User> = async (team, args, { prisma }, info) => {
  const [user] = await prisma.query.users({ where: { team: { id: team.id } } });

  return user;
};

const enrollments: Resolver<TeamEnrollment[]> = async (team, args, { prisma }, info) => {
  const enrollments = await prisma.query.teamEnrollments({ where: { team: { id: team.id } } });

  return enrollments;
};

export const Team = {
  scores,
  owner,
  enrollments
};
