import { compare, hash } from "bcryptjs";
import { GraphQLError } from "graphql";
import { sign } from "jsonwebtoken";

import { Cartola } from "../../api/cartola";
import { User } from "../../prisma";
import { Resolver } from "../../typings";
import { appSecret } from "../../utils";

interface AuthPayload {
  token: string;
  info: string;
  user: User;
}

const login: Resolver<AuthPayload> = async (root, { email, password }, { prisma }, info) => {
  const user = await prisma.query.user({ where: { email } });

  if (!user) {
    const { token } = await Cartola.login(email, password);

    if (token) {
      const team = await Cartola.getTeam(token);
      const scores = (await Cartola.getTeamScores(team.cartolaSlug)).filter(s => s !== null);     
      
      const [currentSeason] = await prisma.query.seasons({ where: { current: true } });

      const newUser = await prisma.mutation.createUser({
        data: {
          globoToken: token,
          email,
          password: await hash(password, 10),
          team: { create: { ...team, scores: { create: scores.map(s => ({ ...s, season: { connect: { id: currentSeason.id } } })) } } },
          wallet: { create: {} }
        }
      });

      return {
        token: sign({ userId: newUser.id }, appSecret, { noTimestamp: true }),
        info: "Novo usuário criado com sucesso!",
        user: newUser
      };
    }
  }

  const isValidPassword = await compare(password, user.password);

  if (!isValidPassword) {
    throw new GraphQLError("Credenciais inválidas.");
  }

  return {
    token: sign({ userId: user.id }, appSecret, { noTimestamp: true }),
    info: "Logado.",
    user
  };
};

export default {
  login
};
