import { prisma } from '@/lib/prisma';
import {
  AptosAccount,
  AptosClient,
  CoinClient,
  FaucetClient,
  HexString,
  Network,
  Provider,
} from 'aptos';
import {
  createOnChainUserIfTheyDoNotExist,
  rewardSpinIfDailyTaskComplete,
} from './actions';
import {
  ContractAccountCommentEvent,
  ContractAccountCreatedEvent,
  ContractAccountFollowEvent,
  ContractAccountLikeEvent,
  ContractAccountPostEvent,
  ContractAccountUnfollowEvent,
  ContractComment,
  ContractEventStoreLabel,
  ContractGetAccountCommentsResponse,
  ContractGetAccountFollowersResponse,
  ContractGetAccountFollowingsResponse,
  ContractGetAccountLikedCommentsResponse,
  ContractGetAccountLikedPostsResponse,
  ContractGetAccountPostsResponse,
  ContractGetFollowingTimelineResponse,
  ContractGetGlobalTimelineResponse,
  ContractGetPostResponse,
  ContractPost,
  ContractUnlikeEvent,
  User,
} from './types';
import { sub } from 'date-fns';

const MODULE_ADDRESS =
  process.env.MODULE_ADDRESS ||
  '0xa4dce8203e0879255d119409f3d45296c08f9c895ff820a9b6865e2ef4e2148a';
const RESOURCE_ACCOUNT_ADDRESS =
  process.env.RESOURCE_ACCOUNT_ADDRESS ||
  '0xea1c898cd51f268f7ce4393317c5598dcd2f58d05fb69d651b500e1de6732f48';
const MODULE_NAME = process.env.MODULE_NAME || 'over_network';

const client = new AptosClient('https://fullnode.testnet.aptoslabs.com');
const faucetClient = new FaucetClient(
  'https://fullnode.testnet.aptoslabs.com',
  'https://faucet.testnet.aptoslabs.com'
);
const coinClient = new CoinClient(client);
const provider = new Provider(Network.TESTNET);

const FUNDING_ACCOUNT_PRIVATE_KEY = process.env.FUNDING_ACCOUNT_PRIVATE_KEY;
const FUNDING_THRESHOLD = 5000_0000;
const TRANSACTION_OPTIONS = {
  max_gas_amount: '500000',
  gas_unit_price: '100',
};

async function fundAccount(accountToFund: AptosAccount) {
  if (FUNDING_ACCOUNT_PRIVATE_KEY) {
    const fundingAccount = new AptosAccount(
      new HexString(FUNDING_ACCOUNT_PRIVATE_KEY).toUint8Array()
    );
    const transfer = await coinClient.transfer(
      fundingAccount,
      accountToFund,
      2500_0000,
      {
        createReceiverIfMissing: true,
      }
    );
    await client.waitForTransaction(transfer, { checkSuccess: true });
  } else {
    await faucetClient.fundAccount(accountToFund.address(), 2500_0000, 5);
  }
}

export async function createUser(
  user: Omit<User, 'id' | 'followers' | 'following'>
) {
  let aptAccount: AptosAccount;
  if (!user.privateKey) {
    aptAccount = new AptosAccount();
  } else {
    aptAccount = new AptosAccount(
      new HexString(user.privateKey).toUint8Array()
    );
  }

  await fundAccount(aptAccount);

  const rawTxn = await provider.generateTransaction(
    aptAccount.address(),
    {
      function: `${MODULE_ADDRESS}::${MODULE_NAME}::create_account`,
      type_arguments: [],
      arguments: [user.username, user.name, user.imgSrc || '', []],
    },
    TRANSACTION_OPTIONS
  );

  const tx = await provider.signAndSubmitTransaction(aptAccount, rawTxn);

  await client.waitForTransaction(tx, { checkSuccess: true });
}

export async function updateBio(user: User, bio: string) {
  await createOnChainUserIfTheyDoNotExist();

  const aptAccount = new AptosAccount(
    new HexString(user.privateKey).toUint8Array()
  );

  if (
    (await coinClient.checkBalance(aptAccount.address())) < FUNDING_THRESHOLD
  ) {
    await fundAccount(aptAccount);
  }

  const rawTxn = await provider.generateTransaction(
    aptAccount.address(),
    {
      function: `${MODULE_ADDRESS}::${MODULE_NAME}::update_bio`,
      type_arguments: [],
      arguments: [user.username, bio],
    },
    TRANSACTION_OPTIONS
  );

  const tx = await provider.signAndSubmitTransaction(aptAccount, rawTxn);

  await client.waitForTransaction(tx, { checkSuccess: true });
}

export async function updateProfilePicture(user: User, imgSrc: string) {
  await createOnChainUserIfTheyDoNotExist();

  const aptAccount = new AptosAccount(
    new HexString(user.privateKey).toUint8Array()
  );

  if (
    (await coinClient.checkBalance(aptAccount.address())) < FUNDING_THRESHOLD
  ) {
    await fundAccount(aptAccount);
  }

  const rawTxn = await provider.generateTransaction(
    aptAccount.address(),
    {
      function: `${MODULE_ADDRESS}::${MODULE_NAME}::update_profile_picture`,
      type_arguments: [],
      arguments: [user.username, imgSrc],
    },
    TRANSACTION_OPTIONS
  );

  const tx = await provider.signAndSubmitTransaction(aptAccount, rawTxn);

  await client.waitForTransaction(tx, { checkSuccess: true });
}

export async function follow(user: User, usernameToFollow: string) {
  await createOnChainUserIfTheyDoNotExist();

  const aptAccount = new AptosAccount(
    new HexString(user.privateKey).toUint8Array()
  );

  if (
    (await coinClient.checkBalance(aptAccount.address())) < FUNDING_THRESHOLD
  ) {
    await fundAccount(aptAccount);
  }

  const rawTxn = await provider.generateTransaction(
    aptAccount.address(),
    {
      function: `${MODULE_ADDRESS}::${MODULE_NAME}::follow`,
      type_arguments: [],
      arguments: [user.username, usernameToFollow],
    },
    TRANSACTION_OPTIONS
  );

  const tx = await provider.signAndSubmitTransaction(aptAccount, rawTxn);

  await client.waitForTransaction(tx, { checkSuccess: true });

  await prisma.follow.create({
    data: {
      follower: { connect: { username: user.username } },
      following: { connect: { username: usernameToFollow } },
    },
  });
}

export async function unfollow(user: User, usernameToUnfollow: string) {
  await createOnChainUserIfTheyDoNotExist();

  const aptAccount = new AptosAccount(
    new HexString(user.privateKey).toUint8Array()
  );

  if (
    (await coinClient.checkBalance(aptAccount.address())) < FUNDING_THRESHOLD
  ) {
    await fundAccount(aptAccount);
  }

  const rawTxn = await provider.generateTransaction(
    aptAccount.address(),
    {
      function: `${MODULE_ADDRESS}::${MODULE_NAME}::unfollow`,
      type_arguments: [],
      arguments: [user.username, usernameToUnfollow],
    },
    TRANSACTION_OPTIONS
  );

  const tx = await provider.signAndSubmitTransaction(aptAccount, rawTxn);

  await client.waitForTransaction(tx, { checkSuccess: true });

  const prismaFollower = await prisma.user.findUnique({
    where: { username: user.username },
  });
  const prismaFollowing = await prisma.user.findUnique({
    where: { username: usernameToUnfollow },
  });

  try {
    prismaFollower &&
      prismaFollowing &&
      (await prisma.follow.delete({
        where: {
          follower_id_following_id: {
            follower_id: prismaFollower.id,
            following_id: prismaFollowing.id,
          },
        },
      }));
  } catch (e) {}
}

export async function createPost(user: User, body: string) {
  const prev = await prisma.post.findMany({
    where: {
      user: { username: user.username },
      created_at: { gt: sub(new Date(), { minutes: 5 }) },
    },
  });

  if (prev.length >= 10) {
    throw new Error('ETooFast');
  }

  await createOnChainUserIfTheyDoNotExist();

  const aptAccount = new AptosAccount(
    new HexString(user.privateKey).toUint8Array()
  );

  if (
    (await coinClient.checkBalance(aptAccount.address())) < FUNDING_THRESHOLD
  ) {
    await fundAccount(aptAccount);
  }

  const rawTxn = await provider.generateTransaction(
    aptAccount.address(),
    {
      function: `${MODULE_ADDRESS}::${MODULE_NAME}::post`,
      type_arguments: [],
      arguments: [user.username, body],
    },
    TRANSACTION_OPTIONS
  );

  const tx = await provider.signAndSubmitTransaction(aptAccount, rawTxn);

  await client.waitForTransaction(tx, { checkSuccess: true });

  await prisma.post.create({
    data: {
      user: { connect: { username: user.username } },
      body,
    },
  });

  await rewardSpinIfDailyTaskComplete();
}

export async function likePost(
  user: User,
  postId: number,
  postUsername: string
) {
  await createOnChainUserIfTheyDoNotExist();

  const aptAccount = new AptosAccount(
    new HexString(user.privateKey).toUint8Array()
  );

  if (
    (await coinClient.checkBalance(aptAccount.address())) < FUNDING_THRESHOLD
  ) {
    await fundAccount(aptAccount);
  }

  const rawTxn = await provider.generateTransaction(
    aptAccount.address(),
    {
      function: `${MODULE_ADDRESS}::${MODULE_NAME}::like`,
      type_arguments: [],
      arguments: [user.username, postUsername, 'post', postId],
    },
    TRANSACTION_OPTIONS
  );

  const tx = await provider.signAndSubmitTransaction(aptAccount, rawTxn);

  await client.waitForTransaction(tx, { checkSuccess: true });

  await prisma.like.create({
    data: {
      sender: { connect: { username: user.username } },
      recipient: { connect: { username: postUsername } },
      contract_post_id: postId,
    },
  });

  await rewardSpinIfDailyTaskComplete();
}

export async function unlikePost(
  user: User,
  postId: number,
  postUsername: string
) {
  await createOnChainUserIfTheyDoNotExist();

  const aptAccount = new AptosAccount(
    new HexString(user.privateKey).toUint8Array()
  );

  if (
    (await coinClient.checkBalance(aptAccount.address())) < FUNDING_THRESHOLD
  ) {
    await fundAccount(aptAccount);
  }

  const rawTxn = await provider.generateTransaction(
    aptAccount.address(),
    {
      function: `${MODULE_ADDRESS}::${MODULE_NAME}::unlike`,
      type_arguments: [],
      arguments: [user.username, postUsername, 'post', postId],
    },
    TRANSACTION_OPTIONS
  );

  const tx = await provider.signAndSubmitTransaction(aptAccount, rawTxn);

  await client.waitForTransaction(tx, { checkSuccess: true });

  const prismaSender = await prisma.user.findUnique({
    where: { username: user.username },
  });
  const prismaRecipient = await prisma.user.findUnique({
    where: { username: postUsername },
  });

  try {
    prismaSender &&
      prismaRecipient &&
      (await prisma.like.delete({
        where: {
          sender_id_recipient_id_contract_post_id: {
            sender_id: prismaSender.id,
            recipient_id: prismaRecipient.id,
            contract_post_id: postId,
          },
        },
      }));
  } catch (e) {}
}

export async function createComment(
  user: User,
  postId: number,
  postUsername: string,
  body: string
) {
  await createOnChainUserIfTheyDoNotExist();

  const aptAccount = new AptosAccount(
    new HexString(user.privateKey).toUint8Array()
  );

  if (
    (await coinClient.checkBalance(aptAccount.address())) < FUNDING_THRESHOLD
  ) {
    await fundAccount(aptAccount);
  }

  const rawTxn = await provider.generateTransaction(
    aptAccount.address(),
    {
      function: `${MODULE_ADDRESS}::${MODULE_NAME}::comment`,
      type_arguments: [],
      arguments: [user.username, body, postUsername, postId],
    },
    TRANSACTION_OPTIONS
  );

  const tx = await provider.signAndSubmitTransaction(aptAccount, rawTxn);

  await client.waitForTransaction(tx, { checkSuccess: true });

  await prisma.post.create({
    data: {
      user: { connect: { username: user.username } },
      body,
      is_comment: true,
    },
  });

  await rewardSpinIfDailyTaskComplete();
}

export async function getGlobalTimeline(
  viewerUsername = '',
  page_size: number,
  page_index: number
) {
  const response = (await provider.view({
    function: `${MODULE_ADDRESS}::${MODULE_NAME}::get_global_timeline`,
    type_arguments: [],
    arguments: [viewerUsername, page_size.toString(), page_index.toString()],
  })) as ContractGetGlobalTimelineResponse;

  const userData = response[0];
  const posts = response[1];
  const likedPosts = response[2];

  return posts.map((post: ContractPost, index: number) => {
    return {
      userData: userData[index],
      post,
      liked: likedPosts[index],
    };
  });
}

export async function getFollowingTimelineOld(
  username: string,
  viewUsername = '',
  page_size: number,
  page_index: number
) {
  const response = (await provider.view({
    function: `${MODULE_ADDRESS}::${MODULE_NAME}::get_following_timeline`,
    type_arguments: [],
    arguments: [username, viewUsername, `${page_size}`, `${page_index}`],
  })) as ContractGetFollowingTimelineResponse;

  const userData = response[0];
  const posts = response[1];
  const likedPosts = response[2];

  return posts.map((post: ContractPost, index: number) => {
    return {
      userData: userData[index],
      post,
      liked: likedPosts[index],
    };
  });
}

export async function getAccountPosts(
  username: string,
  viewUsername = '',
  page_size: number,
  page_index: number
) {
  const response = (await provider.view({
    function: `${MODULE_ADDRESS}::${MODULE_NAME}::get_account_posts`,
    type_arguments: [],
    arguments: [username, viewUsername, `${page_size}`, `${page_index}`],
  })) as ContractGetAccountPostsResponse;

  const userData = response[0];
  const posts = response[1];
  const likedPosts = response[2];

  return {
    userData,
    posts: posts.map((post: ContractPost, index: number) => {
      return {
        post,
        liked: likedPosts[index],
      };
    }),
  };
}

export async function getAccountComments(
  username: string,
  viewUsername = '',
  page_size: number,
  page_index: number
) {
  const response = (await provider.view({
    function: `${MODULE_ADDRESS}::${MODULE_NAME}::get_account_comments`,
    type_arguments: [],
    arguments: [username, viewUsername, page_size, page_index],
  })) as ContractGetAccountCommentsResponse;

  const userData = response[0];
  const comments = response[1];
  const posts = response[2];
  const post_author_data = response[3];
  const likedComments = response[4];
  const likedPosts = response[5];

  return {
    userData,
    comments: comments.map((comment: ContractComment, index: number) => {
      return {
        comment,
        commentliked: likedComments[index],
        post: posts[index],
        post_author_data: post_author_data[index],
        postLiked: likedPosts[index],
      };
    }),
  };
}

export async function getAccountLikedPosts(
  username: string,
  viewUsername = '',
  page_size: number,
  page_index: number
) {
  const response = (await provider.view({
    function: `${MODULE_ADDRESS}::${MODULE_NAME}::get_account_liked_posts`,
    type_arguments: [],
    arguments: [username, viewUsername, page_size, page_index],
  })) as ContractGetAccountLikedPostsResponse;

  const userData = response[0];
  const posts = response[1];
  const post_author_data = response[2];
  const likedPosts = response[3];

  return {
    userData,
    posts: posts.map((post: ContractPost, index: number) => {
      return {
        post,
        post_author_data: post_author_data[index],
        liked: likedPosts[index],
      };
    }),
  };
}

export async function getAccountLikedComments(
  username: string,
  viewUsername = '',
  page_size: number,
  page_index: number
) {
  const response = (await provider.view({
    function: `${MODULE_ADDRESS}::${MODULE_NAME}::get_account_liked_comments`,
    type_arguments: [],
    arguments: [username, viewUsername, page_size, page_index],
  })) as ContractGetAccountLikedCommentsResponse;

  const userData = response[0];
  const comments = response[1];
  const comment_author_data = response[2];
  const posts = response[3];
  const post_author_data = response[4];
  const likedComments = response[5];
  const likedPosts = response[6];

  return {
    userData,
    comments: comments.map((comment: ContractComment, index: number) => {
      return {
        comment,
        comment_author_data: comment_author_data[index],
        commentliked: likedComments[index],
        post: posts[index],
        post_author_data: post_author_data[index],
        postLiked: likedPosts[index],
      };
    }),
  };
}

export async function getAccountFollowers(
  username: string,
  page_size: number,
  page_index: number
) {
  const response = (await provider.view({
    function: `${MODULE_ADDRESS}::${MODULE_NAME}::get_account_followers`,
    type_arguments: [],
    arguments: [username, `${page_size}`, `${page_index}`],
  })) as ContractGetAccountFollowersResponse;

  const userData = response[0];
  const followerData = response[1];

  return {
    userData,
    followerData,
  };
}

export async function getAccountFollowings(
  username: string,
  page_size: number,
  page_index: number
) {
  const response = (await provider.view({
    function: `${MODULE_ADDRESS}::${MODULE_NAME}::get_account_followings`,
    type_arguments: [],
    arguments: [username, `${page_size}`, `${page_index}`],
  })) as ContractGetAccountFollowingsResponse;

  const userData = response[0];
  const followingData = response[1];

  return {
    userData,
    followingData,
  };
}

export async function getPost(
  username: string,
  viewUsername = '',
  post_id: number,
  page_size: number,
  page_index: number
) {
  const response = (await provider.view({
    function: `${MODULE_ADDRESS}::${MODULE_NAME}::get_post`,
    type_arguments: [],
    arguments: [
      username,
      viewUsername,
      `${post_id}`,
      `${page_size}`,
      `${page_index}`,
    ],
  })) as ContractGetPostResponse;

  const userData = response[0];
  const post = response[1];
  const hasLiked = response[2];
  const comments = response[3];
  const comment_author_data = response[4];

  return {
    userData,
    post,
    hasLiked,
    comments: comments.map((comment: ContractComment, index: number) => {
      return {
        comment,
        comment_author_data: comment_author_data[index],
      };
    }),
  };
}

export async function getAccountHistory(
  username: string,
  page_size: number,
  page_index: number
) {
  const event_lists = Promise.all([
    getEvents('account_created_events', username),
    getEvents('account_follow_events', username),
    getEvents('account_unfollow_events', username),
    getEvents('account_post_events', username),
    getEvents('account_comment_events', username),
    getEvents('account_like_events', username),
    getEvents('account_unlike_events', username),
  ]);

  const events = (await event_lists).flat().sort((a, b) => {
    return b.timestamp - a.timestamp;
  });

  return events.slice(page_index * page_size, (page_index + 1) * page_size);
}

export async function getEvents(
  eventLabel: ContractEventStoreLabel,
  username?: string
) {
  const response = await provider.getEventsByEventHandle(
    RESOURCE_ACCOUNT_ADDRESS,
    `${MODULE_ADDRESS}::${MODULE_NAME}::ModuleEventStore`,
    eventLabel,
    {
      limit: 1_000_000,
    }
  );

  if (username) {
    switch (eventLabel) {
      case 'account_created_events':
        response.filter((event) => {
          return event.data.username === username;
        });
        break;
      case 'account_follow_events':
        response.filter((event) => {
          return (
            event.data.follower_account_username === username ||
            event.data.following_account_username === username
          );
        });
        break;
      case 'account_unfollow_events':
        response.filter((event) => {
          return (
            event.data.unfollower_account_username === username ||
            event.data.unfollowing_account_username === username
          );
        });
        break;
      case 'account_post_events':
        response.filter((event) => {
          return event.data.poster_username === username;
        });
        break;
      case 'account_comment_events':
        response.filter((event) => {
          return (
            event.data.commenter_username === username ||
            event.data.post_owner_username === username
          );
        });
        break;
      case 'account_like_events':
        response.filter((event) => {
          return (
            event.data.liker_username === username ||
            event.data.publication_owner_username === username
          );
        });
        break;
      case 'account_unlike_events':
        response.filter((event) => {
          return (
            event.data.unliker_username === username ||
            event.data.publication_owner_username === username
          );
        });
        break;
    }
  }

  let data;
  switch (eventLabel) {
    case 'account_created_events':
      data = response.map((event) => {
        return event.data as ContractAccountCreatedEvent;
      });
      break;
    case 'account_follow_events':
      data = response.map((event) => {
        return event.data as ContractAccountFollowEvent;
      });
      break;
    case 'account_unfollow_events':
      data = response.map((event) => {
        return event.data as ContractAccountUnfollowEvent;
      });
      break;
    case 'account_post_events':
      data = response.map((event) => {
        return event.data as ContractAccountPostEvent;
      });
      break;
    case 'account_comment_events':
      data = response.map((event) => {
        return event.data as ContractAccountCommentEvent;
      });
      break;
    case 'account_like_events':
      data = response.map((event) => {
        return event.data as ContractAccountLikeEvent;
      });
      break;
    case 'account_unlike_events':
      data = response.map((event) => {
        return event.data as ContractUnlikeEvent;
      });
      break;
    default:
      throw new Error('Invalid event label');
  }

  return data;
}

export async function getFollowingTimeline(
  username: string,
  viewerUsername = '',
  page_size: number,
  page_index: number
) {
  const following_users = await getAccountFollowings(
    username,
    1_000_000,
    0
  ).then((response) => {
    return response.followingData;
  });

  const postsByFollowing = await Promise.all(
    following_users.map(async (following_user) => {
      return await getAccountPosts(
        following_user.username,
        viewerUsername,
        1_000_000,
        0
      ).then((response) => {
        return response.posts.map((post) => {
          return {
            userData: following_user,
            post: post.post,
            liked: post.liked,
          };
        });
      });
    })
  );

  // console.log(postsByFollowing)

  const posts = postsByFollowing
    .flat()
    .sort((a, b) => {
      return b.post.timestamp - a.post.timestamp;
    })
    .slice(page_index * page_size, (page_index + 1) * page_size);

  // console.log(posts)

  return posts.map((post) => {
    return {
      userData: post.userData,
      post: post.post,
      liked: post.liked,
    };
  });
}
