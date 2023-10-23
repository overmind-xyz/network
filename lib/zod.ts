import { z } from 'zod';

export const newUserSchema = z.object({
  username: z.string(),
  name: z.string(),
  imgSrc: z.string().optional(),
});

export const newCommentSchema = z.object({
  body: z.string().min(1).max(280),
});

export const newPostSchema = z.object({
  body: z.string().min(1).max(280),
});

export const newLikeSchema = z.object({
  postId: z.number(),
  postUsername: z.string(),
});

export const followSchema = z.object({
  username: z.string(),
});

export const addressSchema = z.object({
  address: z.string().startsWith('0x'),
});