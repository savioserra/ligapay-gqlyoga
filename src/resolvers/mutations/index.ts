import auth from "./auth";
import transaction from "./transaction";

const Mutation = {
  ...transaction,
  ...auth
};

export default Mutation;
