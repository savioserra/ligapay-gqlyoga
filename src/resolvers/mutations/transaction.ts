import uuid = require("uuid/v4");
import { Resolver } from "../../typings";

interface TransactionPayload {
  success: boolean;
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

export default {
  createTransaction
};
