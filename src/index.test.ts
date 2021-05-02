import { imm, woo } from "./index.js";

import test from "ava";

interface Person {
    name: string;
    age: number;
    email: string;
}

test("imm only allows initialisation assigment", t => {
    const person = imm({
        name: "David",
        age: 42,
        email: "test@example.com",
    } as Person);

    t.is(person.name, "David");
    t.throws(() => (person.name = "Jerry"));
    t.is(person.name, "David");
});

test("imm doesn't alllow extensions", t => {
    const person = imm({
        name: "David",
        age: 42,
        email: "test@example.com",
    } as Person);

    // @ts-expect-error
    t.throws(() => (person.printName = () => console.log(person.name)));
    // @ts-expect-error
    t.is(person.printName, undefined);

    t.throws(() => {
        Object.defineProperty(person, "printName", {
            value: () => console.log(person.name),
        });
    });
});

interface WooPerson {
    name: string | null;
    age: number | null;
    email: string | null;
}

test("woo only allows single assignment", t => {
    const person = woo({
        name: null,
        age: null,
        email: null,
    } as WooPerson);

    t.is(person.name, null);
    person.name = "David";
    t.is(person.name, "David");
    t.throws(() => (person.name = "Jerry"));
    t.is(person.name, "David");
});

test("woo doesn't alllow extensions", t => {
    const person = woo({
        name: null,
        age: null,
        email: null,
    } as WooPerson);

    t.is(person.name, null);
    person.name = "David";
    t.is(person.name, "David");

    // @ts-expect-error
    t.throws(() => (person.printName = () => console.log(person.name)));
    // @ts-expect-error
    t.is(person.printName, undefined);

    t.throws(() => {
        Object.defineProperty(person, "printName", {
            value: () => console.log(person.name),
        });
    });
});
