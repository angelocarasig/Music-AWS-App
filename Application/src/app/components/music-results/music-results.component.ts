import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { MusicItem } from '../../models/music_item';
import { MusicTitleCasePipe } from '../../music-titlecase.pipe';

@Component({
  selector: 'app-music-results',
  standalone: true,
  imports: [CommonModule, MusicTitleCasePipe],
  templateUrl: './music-results.component.html',
  styleUrl: './music-results.component.css'
})
export class MusicResultsComponent implements OnChanges {
  @Input() musicItems: Array<MusicItem>;
  @Input() processedMusicItem: MusicItem | null;
  @Output() subscribeEmitter: EventEmitter<MusicItem> = new EventEmitter<MusicItem>();

  getMusicUrl(musicItem: MusicItem): string {
    const musicUrlOptions = {
      title: encodeURIComponent(musicItem.title.toLowerCase().replaceAll(" ", "_")),
      artist: encodeURIComponent(musicItem.artist.toLowerCase().replaceAll(" ", "_")),
      year: musicItem.year,
    }
    return `https://s3906344-cosc2626-a1-music.s3.amazonaws.com/${musicUrlOptions.title}-${musicUrlOptions.artist}-${musicUrlOptions.year}.jpg`
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    // Search for music item and update processing property
    if (changes.processedMusicItem && changes.processedMusicItem.currentValue !== null) {
      const updatedMusicItem: MusicItem = changes.processedMusicItem.currentValue;
      this.musicItems.find(
        musicItem => musicItem.title === updatedMusicItem.title && 
        musicItem.artist === updatedMusicItem.artist && 
        musicItem.year === updatedMusicItem.year
      )!.processing = false;
    }
  }

  getMusicItemButtonTitle(musicItem: MusicItem): string {
    return musicItem.subscribed ? "Subscribed!": "Subscribe";
  }

  subscribeToItem(musicItem: MusicItem): void {
    if (musicItem.subscribed) {
      alert("You have already subscribed to this!");
      return;
    }

    musicItem.processing = true;
    this.subscribeEmitter.emit(musicItem);
  }
}
