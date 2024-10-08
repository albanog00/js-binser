import { BinarySerializer } from "./serializer/serializer";
import { Person } from "./person";

const person = new Person(
  "Peppe",
  23,
  new Array<number>(10_000_000).fill(Math.pow(2, 31) - 1),
);

const buffer = BinarySerializer.encode(person);
console.log(buffer);

const obj = BinarySerializer.decode<Person>(buffer);
console.log(obj);
