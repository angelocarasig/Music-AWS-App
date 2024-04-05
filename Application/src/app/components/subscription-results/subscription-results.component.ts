import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { MusicItem } from '../../models/music_item';
import { CommonModule } from '@angular/common';
import { MusicTitleCasePipe } from '../../music-titlecase.pipe';

@Component({
  selector: 'app-subscription-results',
  standalone: true,
  imports: [CommonModule, MusicTitleCasePipe],
  templateUrl: './subscription-results.component.html',
  styleUrl: './subscription-results.component.css'
})
export class SubscriptionResultsComponent implements OnChanges {
  @Input() musicItems: Array<MusicItem>;
  @Input() processedSubscriptionMusicItem: MusicItem | null;
  @Output() unsubscribeEmitter: EventEmitter<MusicItem> = new EventEmitter<MusicItem>();

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
    if (changes.processedSubscriptionMusicItem && changes.processedSubscriptionMusicItem.currentValue !== null) {
      const updatedMusicItem: MusicItem = changes.processedSubscriptionMusicItem.currentValue;
      this.musicItems.find(
        musicItem => musicItem.title === updatedMusicItem.title && 
        musicItem.artist === updatedMusicItem.artist && 
        musicItem.year === updatedMusicItem.year
      )!.processing = false;
    }
  }

  unsubscribeToItem(musicItem: MusicItem): void {
    musicItem.processing = true;
    this.unsubscribeEmitter.emit(musicItem);
  }

  getMusicItemButtonTitle(musicItem: MusicItem): string {
    return musicItem.subscribed ? "Subscribed!": "Subscribe";
  }
}
