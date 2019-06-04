import { rule } from "graphql-shield";
import { getUserId } from "../utils";

const rules = {
  isAuthenticatedUser: rule()((parent, args, context) => {
    const userId = getUserId(context);

    return Boolean(userId);
  }),

  //   isWalletOwner: rule()(async (parent, args, context, info) => {
  //     const id = getUserId(context);
  //     const userWallet = await context.prisma.user({ id }).wallet();
  //     const [wallet] = await context.prisma.wallets({
  //       where: { user: { id: parent.id } }
  //     });

  //     return userWallet.id === wallet.id;
  //   }),

  isOrigin: rule()(async (parent, args, context, info) => {
    const id = getUserId(context);
    const user = await context.prisma
      .transaction({ id: parent.id })
      .origin()
      .user();

    return user.id === id;
  }),

  //   isDestination: rule()(async (parent, args, context, info) => {
  //     const id = getUserId(context);
  //     const user = await context.prisma
  //       .transaction({ id: parent.id })
  //       .destination()
  //       .user();

  //     return user.id === id;
  //   }),

  canTransferFunds: rule()(async (parent, { origin }, context, info) => {
    const id = getUserId(context);
    const [user] = await context.prisma.query.users({ where: { wallet: { id: origin } } });

    return user.id === id;
  })
};

export const Mutation = {
  createTransaction: rules.canTransferFunds,
  createCard: rules.isAuthenticatedUser
};
