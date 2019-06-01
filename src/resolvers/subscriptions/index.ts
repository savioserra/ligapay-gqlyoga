export default {
  count: {
    subscribe: async (root, args, { pubsub }) => {
      const channel = "teste";
      let count = 0;

      setInterval(() => pubsub.publish(channel, count++ ), 5000);

      return pubsub.asyncIterator(channel);
    },

    resolve: data => data
  }
};
