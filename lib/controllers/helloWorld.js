import Person from '../models/Person';

export default {
  index: async (ctx) => {
    const person = new Person('Hello world!');

    ctx.body = {
      message: person.talk(),
    };
  },
};
