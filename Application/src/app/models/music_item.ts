export interface MusicItem {
  title: string;
  artist: string;
  year: string;
  img_url: string;
  subscribed?: boolean;
  processing?: boolean;
}