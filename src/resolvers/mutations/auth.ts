import { compare, hash } from "bcryptjs";
import { GraphQLError } from "graphql";
import { sign } from "jsonwebtoken";

import { Cartola } from "../../api/cartola";
import { Resolver } from "../../typings";
import { appSecret } from "../../utils";

interface AuthPayload {
  token: string;
  info: string;
}

const login: Resolver<AuthPayload> = async (root, { email, password }, { prisma }) => {
  const user = await prisma.query.user({ where: { email } });

  if (!user) {
    const { token } = await Cartola.login(email, password);

    if (token) {
      const team = await Cartola.getTeam(token);

      const newUser = await prisma.mutation.createUser({
        data: {
          globoToken: token,
          email,
          password: await hash(password, 10),
          team: { create: team },
          wallet: { create: {} }
        }
      });

      return {
        token: sign({ userId: newUser.id }, appSecret),
        info: "Novo usuário criado com sucesso!"
      };
    }
  }

  const isValidPassword = await compare(password, user.password);

  if (!isValidPassword) {
    throw new GraphQLError("Credenciais inválidas.");
  }

  return {
    token: sign({ userId: user.id }, appSecret),
    info: "Logado."
  };
};

export default {
  login
};
