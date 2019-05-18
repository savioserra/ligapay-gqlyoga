import { Resolver } from "../../typings";

interface TransactionPayload {
  success: boolean;
  info: string;
}

export const createTransaction: Resolver<TransactionPayload> = async (root, args, { prisma }, info) => {
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

  const { data } = await prisma.request(`
      mutation CreateTransaction {
        executeRaw(query: "call create_transaction('${origin}', '${destination}', ${amount})")
      }
  `);

  const code = !!data ? data.executeRaw : 1;

  return {
    success: code === 0,
    info: code === 0 ? "Transação realizada com sucesso." : "Ops, ocorreu um erro. Verifique o saldo em sua carteira e tente novamente."
  };
};
