export class Person {
  name: string;
  age: number;
  grades: Array<number>;
  isAdult: boolean;

  constructor(name: string, age: number, grades: Array<number>) {
    this.name = name;
    this.age = age;
    this.grades = grades;
    this.isAdult = age >= 18;
  }
}
