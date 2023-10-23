import { generateFloats } from '@/lib/rng';
import { createId } from '@paralleldrive/cuid2';

(async () => {
  const prizes = {
    0: 0,
    1: 0,
    10: 0,
    100: 0,
    1000: 0,
    10000: 0,
    100000: 0,
    500000: 0,
    1000000: 0,
  };

  for (let i = 1; i < 1000000; i++) {
    const newResult = generateFloats({
      serverSeed: createId(),
      clientSeed: 'clnp79odb001zrlozphlu30w9',
      nonce: 0,
      roll: 0,
      count: 1,
    });

    const result = Math.floor(newResult[0]! * 100000001) / 100000000;

    let prize: keyof typeof prizes = 0;

    if (result < 0.5) {
      prize = 0;
    } else if (result < 0.9449) {
      prize = 1;
    } else if (result < 0.9949) {
      prize = 10;
    } else if (result < 0.999) {
      prize = 100;
    } else if (result < 0.9999) {
      prize = 1000;
    } else if (result < 0.999999) {
      prize = 10000;
    } else if (result < 0.9999999) {
      prize = 100000;
    } else if (result < 0.99999999) {
      prize = 500000;
    } else {
      prize = 1000000;
    }

    prizes[prize] += 1;

    console.log('Roll ' + i + ' of 1000000');
  }

  console.log(prizes);

  for (const [key, value] of Object.entries(prizes)) {
    console.log(`$${Number(key) / 100}: ${(value / 1000000) * 100}%`);
  }
})();
