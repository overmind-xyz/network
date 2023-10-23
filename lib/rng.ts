import { createHmac } from 'crypto';
import _ from 'lodash';

export type ByteGenerationType = {
  serverSeed: string;
  clientSeed: string;
  nonce: number;
  roll: number;
};

// Random number generation based on following inputs: serverSeed, clientSeed, nonce and roll
export function* byteGenerator({
  serverSeed,
  clientSeed,
  nonce,
  roll,
}: ByteGenerationType) {
  // Setup roll variables
  let currentRound = Math.floor(roll / 32);
  let currentRoundCursor = roll;
  currentRoundCursor -= currentRound * 32;

  // Generate outputs until roll requirement fulfilled
  while (true) {
    // HMAC function used to output provided inputs into bytes
    const hmac = createHmac('sha256', serverSeed);
    hmac.update(`${clientSeed}:${nonce}:${currentRound}`);
    const buffer = hmac.digest();

    // Update roll for next iteration of loop
    while (currentRoundCursor < 32) {
      yield Number(buffer[currentRoundCursor]);
      currentRoundCursor += 1;
    }
    currentRoundCursor = 0;
    currentRound += 1;
  }
}

export type GenerateFloatsType = {
  serverSeed: string;
  clientSeed: string;
  nonce: number;
  roll: number;
  count: number;
};

// Convert the hash output from the rng byteGenerator to floats
export function generateFloats({
  serverSeed,
  clientSeed,
  nonce,
  roll,
  count,
}: GenerateFloatsType) {
  // Random number generator function
  const rng = byteGenerator({ serverSeed, clientSeed, nonce, roll });
  // Declare bytes as empty array
  const bytes = [];

  // Populate bytes array with sets of 4 from RNG output
  while (bytes.length < count * 4) {
    bytes.push(rng.next().value);
  }

  // Return bytes as floats using lodash reduce function
  return _.chunk(bytes, 4).map((bytesChunk) =>
    bytesChunk.reduce((result, value, i) => {
      const divider = 256 ** (i + 1);
      const partialResult = value! / divider;
      return result! + partialResult;
    }, 0)
  );
}
