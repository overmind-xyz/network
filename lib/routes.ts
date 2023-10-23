import { stripUsername } from './utils';

export type Page =
  | 'Home'
  | 'Rewards'
  | 'Profile'
  | 'Post'
  | 'Following'
  | 'Followers';

export function href(page: Page, ...params: string[]) {
  switch (page) {
    case 'Home':
      return '/';

    case 'Rewards':
      return '/rewards';

    default:
      const param1 = params[0] || '';

      switch (page) {
        case 'Profile':
          return `/@${stripUsername(param1)}`;

        case 'Following':
          return `/@${stripUsername(param1)}/following`;

        case 'Followers':
          return `/@${stripUsername(param1)}/followers`;

        default:
          const param2 = params[2] || '';

          return `/@${stripUsername(param1)}/status/${param2}`;
      }
  }
}
