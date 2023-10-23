export type Post = {
  id: number;
  author: UserInfo;
  body: string;
  timestamp: number;
  commentCount: number;
  likes: number;
  isLiked?: boolean;
};

export type UserInfo = {
  username: string;
  name: string;
  imgSrc?: string;
  followers?: number;
  following?: number;
};

export type User = UserInfo & {
  privateKey: string;
};

export type Comment = {
  id: number;
  postId: number;
  author: UserInfo;
  body: string;
  timestamp: number;
};

export type AuthType = {
  [key: string]: User;
};

export type HomePage = Post[];

export type ProfilePage = {
  user: UserInfo;
  posts: Post[];
  isFollowed?: boolean;
};

export type FollowPage = {
  user: UserInfo;
  accounts: UserInfo[];
};

export type PostPage = {
  post: Post;
  comments: Comment[];
};

export type FormState = {
  isSuccess?: boolean;
  isError?: boolean;
  message?: string | null;
  errors?: unknown[];
  updates?: unknown[];
};

export type ServerAction = (
  _: FormState,
  __: FormData
) => Promise<FormState | void>;

export type ContractAccountMetaData = {
  creation_timestamp: number;
  account_address: string;
  username: string;
  name: string;
  profile_picture_uri: string;
  bio: string;
  follower_account_usernames: string[];
  following_account_usernames: string[];
};

export type ContractPublicationReference = {
  publication_author_account_address: string;
  publication_type: string;
  publication_index: number;
};

export type ContractPost = {
  timestamp: number;
  id: number;
  content: string;
  comments: ContractPublicationReference[];
  likes: string[];
};

export type ContractComment = {
  timestamp: number;
  id: number;
  content: string;
  reference: ContractPublicationReference;
  likes: string[];
};

export type ContractLike = {
  timestamp: number;
  reference: ContractPublicationReference;
};

export type ContractGetGlobalTimelineResponse = [
  ContractAccountMetaData[],
  ContractPost[],
  boolean[],
];

export type ContractGetFollowingTimelineResponse = [
  ContractAccountMetaData[],
  ContractPost[],
  boolean[],
];

export type ContractGetAccountPostsResponse = [
  ContractAccountMetaData,
  ContractPost[],
  boolean[],
];

export type ContractGetAccountCommentsResponse = [
  ContractAccountMetaData,
  ContractComment[],
  ContractPost[],
  ContractAccountMetaData[],
  boolean[],
  boolean[],
];

export type ContractGetAccountLikedPostsResponse = [
  ContractAccountMetaData,
  ContractPost[],
  ContractAccountMetaData[],
  boolean[],
];

export type ContractGetAccountLikedCommentsResponse = [
  ContractAccountMetaData,
  ContractComment[],
  ContractAccountMetaData[],
  ContractPost[],
  ContractAccountMetaData[],
  boolean[],
  boolean[],
];

export type ContractGetAccountFollowersResponse = [
  ContractAccountMetaData,
  ContractAccountMetaData[],
];

export type ContractGetAccountFollowingsResponse = [
  ContractAccountMetaData,
  ContractAccountMetaData[],
];

export type ContractGetPostResponse = [
  ContractAccountMetaData,
  ContractPost,
  boolean,
  ContractComment[],
  ContractAccountMetaData[],
];

export type ContractAccountCreatedEvent = {
  timestamp: number;
  account_address: string;
  username: string;
  creator: string;
};

export type ContractAccountFollowEvent = {
  timestamp: number;
  follower_account_username: string;
  following_account_username: string;
};

export type ContractAccountUnfollowEvent = {
  timestamp: number;
  unfollower_account_username: string;
  unfollowing_account_username: string;
};

export type ContractAccountPostEvent = {
  timestamp: number;
  poster_username: string;
  post_id: number;
};

export type ContractAccountCommentEvent = {
  timestamp: number;
  post_owner_username: string;
  post_id: number;
  commenter_username: string;
  comment_id: number;
};

export type ContractAccountLikeEvent = {
  timestamp: number;
  publication_owner_username: string;
  publication_type: string;
  publication_id: number;
  liker_username: string;
};

export type ContractUnlikeEvent = {
  timestamp: number;
  publication_owner_username: string;
  publication_type: string;
  publication_id: number;
  unliker_username: string;
};

export type ContractEventStoreLabel =
  | 'account_created_events'
  | 'account_follow_events'
  | 'account_unfollow_events'
  | 'account_post_events'
  | 'account_comment_events'
  | 'account_like_events'
  | 'account_unlike_events';
