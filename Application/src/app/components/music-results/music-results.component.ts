import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MusicItem } from '../../models/music_item';

@Component({
  selector: 'app-music-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './music-results.component.html',
  styleUrl: './music-results.component.css'
})
export class MusicItemComponent {
  @Input() musicItems: Array<MusicItem>;

  getMusicUrl(musicItem: MusicItem): string {
    const musicUrlOptions = {
      title: musicItem.title.toLowerCase().replaceAll(" ", "_"),
      artist: musicItem.artist.toLowerCase().replaceAll(" ", "_"),
      year: musicItem.year,
    }
    return `https://s3906344-cosc2626-a1-music.s3.amazonaws.com/${musicUrlOptions.title}-${musicUrlOptions.artist}-${musicUrlOptions.year}.jpg`
  }

  subscribeToItem(musicItem: MusicItem): void {
    
  }
}
