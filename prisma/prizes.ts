import { AptosAccount, AptosClient, HexString, Types } from 'aptos';
import { db } from '../server/db';

// SET CONSOLE LOG TO TRUE TO SEE WHAT WOULD BE SENT
const CONSOLE_LOG = false;
// SET APT PRICE
const APT_PRICE = 0;
// SET APT PRIVATE KEY
const PRIV_KEY = new HexString('');

const main = async () => {
  if (!CONSOLE_LOG) {
    if (!APT_PRICE || APT_PRICE <= 0) {
      return console.error('ERROR: Please set the APT price');
    }

    if (
      !PRIV_KEY.toString() ||
      PRIV_KEY.toString() === new HexString('').toString()
    ) {
      return console.error('ERROR: Please set your private key');
    }
  }

  let spins = await db.spin.findMany({
    where: {
      prize: {
        gt: 0,
      },
      has_exchanged: false,
      tx_hash: null,
    },
    select: {
      id: true,
      prize: true,
      user: {
        select: {
          withdrawAddress: true,
        },
      },
    },
  });

  for (let index = 0; index < spins.length; index++) {
    const spin = spins[index];

    if (!spin.prize) {
      console.log('No spin prize');
      continue;
    }

    if (!spin.user.withdrawAddress) {
      console.log('No withdraw address for user');
      continue;
    }

    if (CONSOLE_LOG) {
      console.log('-----------');
      console.log('spin', spin);
      console.log('APT AMOUNT TO SEND', calculateAPTAmountFromUSD(spin.prize));
      continue;
    }

    const distributionSource = new AptosAccount(PRIV_KEY.toUint8Array());
    const aptosClient = new AptosClient(NODE);

    try {
      const payload: Types.TransactionPayload = {
        type: 'entry_function_payload',
        function: '0x1::aptos_account::transfer_coins',
        type_arguments: ['0x1::aptos_coin::AptosCoin'],
        arguments: [
          spin.user.withdrawAddress,
          calculateAPTAmountFromUSD(spin.prize),
        ],
      };

      const rawTxn = await aptosClient.generateTransaction(
        distributionSource.address(),
        payload
      );
      const tx_hash = await aptosClient.signAndSubmitTransaction(
        distributionSource,
        rawTxn
      );

      await aptosClient.waitForTransaction(tx_hash, { checkSuccess: true });

      await db.spin.update({
        where: {
          id: spin.id,
        },
        data: {
          tx_hash,
        },
      });

      console.log(
        `Sent $${spin.prize / 100} (${calculateAPTAmountFromUSD(
          spin.prize
        )} APT)}`
      );
    } catch (e) {
      console.log(e);
      console.log('Error Sending Prize...');
    }
  }
};

main();

const calculateAPTAmountFromUSD = (usd_amount: number) => {
  return Math.floor(
    Number((usd_amount / (APT_PRICE * DOLLAR_DECIMALS)).toFixed(8)) *
      APT_DECIMALS
  );
};

const NODE = 'https://fullnode.mainnet.aptoslabs.com/v1';
const DOLLAR_DECIMALS = 100;
const APT_DECIMALS = 100000000;
