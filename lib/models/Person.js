export default class Person {
  constructor(catchphrase) {
    this.catchphrase = catchphrase;
  }

  talk() {
    return this.catchphrase;
  }
}
