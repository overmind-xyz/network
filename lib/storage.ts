import {
  AuthType,
  Comment,
  ContractAccountMetaData,
  ContractPost,
  FollowPage,
  HomePage,
  Post,
  PostPage,
  ProfilePage,
  User,
  UserInfo,
} from './types';
import { promises as fs } from 'fs';
import { fromUnixTime, isAfter, isBefore } from 'date-fns';
import { PAGE_SIZE, byNewest, byOldest, stripUsername } from './utils';
import * as contract from './contract';
import { getMe } from './actions';
import { cookies } from 'next/headers';

const AUTH_FILE = '../app/storage/auth.json';

export {
  createComment,
  createPost,
  likePost,
  unlikePost,
  follow,
  unfollow,
} from './contract';

function isTransformed(u: UserInfo | ContractAccountMetaData): u is UserInfo {
  try {
    return typeof (u as UserInfo).followers === 'number';
  } catch (e) {
    return false;
  }
}

function transformUser(u: ContractAccountMetaData): UserInfo {
  return {
    username: u.username,
    name: u.name,
    followers: u.follower_account_usernames.length,
    following: u.following_account_usernames.length,
    imgSrc: u.profile_picture_uri,
  };
}

function transformPost(
  p: ContractPost,
  u: UserInfo | ContractAccountMetaData,
  liked?: boolean
): Post {
  return {
    id: p.id,
    author: isTransformed(u) ? u : transformUser(u),
    body: p.content,
    timestamp: p.timestamp,
    commentCount: p.comments.length,
    likes: p.likes.length,
    isLiked: liked || false,
  };
}

export async function getUsers() {
  const fileContents = await fs.readFile(AUTH_FILE, 'utf8');
  const users: AuthType = JSON.parse(fileContents);

  return users;
}

export async function createUser(user: Omit<User, 'followers' | 'following'>) {
  await contract.createUser(user);

  const existing = await getUsers();

  await fs.writeFile(
    AUTH_FILE,
    JSON.stringify(
      Object.assign({}, existing, { [stripUsername(user.username)]: user })
    )
  );
}

export async function getUser(username?: string) {
  if (!username) {
    return undefined;
  }

  const users = await getUsers();

  return users[stripUsername(username)];
}

export async function getComments(
  postId: number,
  username: string,
  page = 0
): Promise<Comment[]> {
  const me = await getMe();
  const data = await contract.getPost(
    username,
    me?.username,
    postId,
    PAGE_SIZE,
    page
  );

  return data.comments
    .map((comment) => {
      return {
        id: comment.comment.id,
        timestamp: comment.comment.timestamp,
        postId: data.post.id,
        author: transformUser(comment.comment_author_data),
        body: comment.comment.content,
      };
    })
    .sort(byOldest);
}

export async function getPostPage(
  postId: number,
  username: string,
  page = 0
): Promise<PostPage> {
  'use server';
  const me = await getMe();
  const data = await contract.getPost(
    username,
    me?.username,
    postId,
    PAGE_SIZE,
    page
  );

  return {
    post: transformPost(data.post, data.userData, data.hasLiked),
    comments: data.comments
      .map((comment) => {
        return {
          id: comment.comment.id,
          timestamp: comment.comment.timestamp,
          postId: data.post.id,
          author: transformUser(comment.comment_author_data),
          body: comment.comment.content,
        };
      })
      .sort(byOldest),
  };
}

export async function getProfilePage(
  username: string,
  viewer: string,
  pageIndex = 0
): Promise<ProfilePage | null> {
  'use server';
  const data = await contract.getAccountPosts(
    username,
    viewer,
    PAGE_SIZE,
    pageIndex
  );

  if (!data) {
    return null;
  }

  const user = transformUser(data.userData);

  return {
    user,
    posts: data.posts
      .map(({ post, liked }) => transformPost(post, user, liked))
      .sort(byNewest),
    isFollowed: data.userData.follower_account_usernames.includes(viewer),
  };
}

export async function getGlobalTimeline(page = 0): Promise<HomePage> {
  'use server';

  const me = await getMe();
  const data = await contract.getGlobalTimeline(me?.username, PAGE_SIZE, page);

  return data
    .map(({ liked, post, userData }) => {
      return transformPost(post, userData, liked);
    })
    .sort(byNewest);
}

export async function getFollowingTimeline(page = 0): Promise<HomePage> {
  'use server';
  const me = (await getMe())!;
  const data = await contract.getFollowingTimeline(
    me.username,
    me.username,
    PAGE_SIZE,
    page
  );

  return data
    .map(({ liked, post, userData }) => {
      return transformPost(post, userData, liked);
    })
    .sort(byNewest);
}

export async function getFollowersPage(
  username: string,
  page = 0
): Promise<FollowPage | null> {
  'use server';
  const data = await contract.getAccountFollowers(
    stripUsername(username),
    100,
    page
  );

  return {
    user: transformUser(data.userData),
    accounts: data.followerData.map(transformUser),
  };
}

export async function getFollowingPage(
  username: string,
  page = 0
): Promise<FollowPage | null> {
  'use server';
  const data = await contract.getAccountFollowings(
    stripUsername(username),
    100,
    page
  );

  return {
    user: transformUser(data.userData),
    accounts: data.followingData.map(transformUser),
  };
}
