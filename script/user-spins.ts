import { prisma } from '@/lib/prisma';
import { generateFloats } from '@/lib/rng';

(async () => {
  const user_id = 'clnulk4xc001tjw08n1p7idfe';

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

  console.log('HERE');

  try {
    const spins = await prisma.spin.findMany({
      where: {
        user_id,
      },
    });

    console.log(spins);

    for (let i = 0; i < spins.length; i++) {
      const spin = spins[i];
      const newResult = generateFloats({
        serverSeed: spin.id,
        clientSeed: user_id,
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

      console.log('Result ', result, ' Prizes ', prize);
    }

    console.log(prizes);
  } catch (e) {
    console.log(e);
  }
})();
