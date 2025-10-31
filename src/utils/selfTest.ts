import { gcd, simplify, multiply, divide, equalFrac } from "./fraction";
import { parseAnswer } from "./parse";

export function runSelfTests() {
  // gcd & simplify tests
  console.assert(gcd(12, 18) === 6, "gcd failed");
  console.assert(JSON.stringify(simplify(2, 4)) === JSON.stringify({ n: 1, d: 2 }), "simplify 2/4 -> 1/2");
  console.assert(JSON.stringify(simplify(-2, 4)) === JSON.stringify({ n: -1, d: 2 }), "simplify sign");
  console.assert(JSON.stringify(simplify(0, 5)) === JSON.stringify({ n: 0, d: 1 }), "simplify zero numerator");

  // multiply / divide
  const m1 = multiply({ n: 2, d: 3 }, { n: 3, d: 4 });
  console.assert(JSON.stringify(m1) === JSON.stringify({ n: 1, d: 2 }), "2/3 * 3/4 = 1/2");
  const d1 = divide({ n: 2, d: 3 }, { n: 3, d: 4 });
  console.assert(JSON.stringify(d1) === JSON.stringify({ n: 8, d: 9 }), "2/3 ÷ 3/4 = 8/9");
  const d2 = divide({ n: -1, d: 2 }, { n: 1, d: 4 });
  console.assert(JSON.stringify(d2) === JSON.stringify({ n: -2, d: 1 }), "-1/2 ÷ 1/4 = -2");

  // equalFrac
  console.assert(equalFrac({ n: 2, d: 4 }, { n: 1, d: 2 }), "equalFrac equivalence");
  console.assert(!equalFrac({ n: 1, d: 3 }, { n: 2, d: 3 }), "equalFrac non-equal");

  // parseAnswer
  console.assert(JSON.stringify(parseAnswer("3/6")) === JSON.stringify({ n: 1, d: 2 }), "parseAnswer reduces");
  console.assert(JSON.stringify(parseAnswer("  3 /   6  ")) === JSON.stringify({ n: 1, d: 2 }), "parseAnswer trims & spaces");
  console.assert(JSON.stringify(parseAnswer("2")) === JSON.stringify({ n: 2, d: 1 }), "parse integer");
  console.assert(JSON.stringify(parseAnswer("1 3/4")) === JSON.stringify({ n: 7, d: 4 }), "parse mixed");
  console.assert(JSON.stringify(parseAnswer("-2 1/2")) === JSON.stringify({ n: -5, d: 2 }), "parse negative mixed");
  console.assert(JSON.stringify(parseAnswer("-3/9")) === JSON.stringify({ n: -1, d: 3 }), "parse negative fraction");
  console.assert(parseAnswer("1/0") === null, "reject zero denominator");
}

