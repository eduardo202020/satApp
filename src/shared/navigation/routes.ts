import { router, type Href } from 'expo-router';

export function navigateTo(path: string) {
  router.push(path as Href);
}

export function asHref(path: string) {
  return path as Href;
}
