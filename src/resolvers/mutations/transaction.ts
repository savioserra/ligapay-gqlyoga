import uuid = require("uuid/v4");
import PagarMe from "../../api/pagarme";
import { Resolver } from "../../typings";
import { getUserId } from "../../utils";

interface TransactionPayload {
  success: boolean;
  info: string;
}

interface CreateCardPayload {
  success: boolean;
  cardId?: string;
  info: string;
}

const createTransaction: Resolver<TransactionPayload> = async (root, args, { prisma }, info) => {
  const { origin, destination, amount } = args;

  if (origin === destination) {
    return {
      success: false,
      info: "Origem e destino devem ser diferentes."
    };
  }

  if (amount <= 0) {
    return {
      success: false,
      info: "Quantidade fornecida é inválida."
    };
  }

  const transactionId = uuid();
  const { data } = await prisma.request(`
      mutation CreateTransaction {
        executeRaw(query: "call create_transaction('${origin}', '${destination}', ${amount}, '${transactionId}')")
      }
  `);

  const success = (!!data ? data.executeRaw : 1) === 0;

  return {
    id: success ? transactionId : null,
    success,
    info: success ? "Transação realizada com sucesso." : "Ops, ocorreu um erro. Verifique o saldo em sua carteira e tente novamente."
  };
};

const createCard: Resolver<CreateCardPayload> = async (root, { card }, ctx) => {
  const id = getUserId(ctx);

  const cardCreate = await PagarMe.createCard(card);

  if (!cardCreate.valid) {
    return {
      cardId: null,
      success: false,
      info: "Cartão informado é inválido."
    };
  }

  const persistedCard = await ctx.prisma.mutation.createCard({ data: { ...cardCreate, user: { connect: { id } } } });

  return {
    cardId: persistedCard.id,
    success: true,
    info: "Cartão cadastrado com sucesso."
  }
};

export default {
  createTransaction,
  createCard
};
