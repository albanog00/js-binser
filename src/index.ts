import { BinarySerializer } from "./binary-serializer";
import { Person } from "./person";

const person = new Person("Peppe", 23, [
  0,
  1,
  (1 << 8) - 1,
  -1,
  (1 << 16) - 1,
  Math.pow(2, 31) - 1,
  -Math.pow(2, 16),
  -Math.pow(2, 31),
]);

const buffer = BinarySerializer.encode(person);

console.log(buffer);
console.log(BinarySerializer.decode(buffer));
