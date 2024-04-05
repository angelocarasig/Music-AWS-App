import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { QueryForm } from '../../models/query';
import { HttpService } from '../../services/http.service';
import { MusicResultsComponent } from '../music-results/music-results.component';
import { SubscriptionResultsComponent } from '../subscription-results/subscription-results.component';
import { MusicItem } from '../../models/music_item';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MusicResultsComponent,
    SubscriptionResultsComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  userSubscriptions: Array<MusicItem> = new Array<MusicItem>();
  subscriptionsLoading = false;

  queryResults: Array<MusicItem> = new Array<MusicItem>();
  queryMatches: Array<MusicItem> = new Array<MusicItem>();

  queryForm: FormGroup<QueryForm>;
  emptyQuery = false;
  queryLoading = false;

  processedSubscriptionMusicItem: MusicItem | null = null;
  processedMusicItem: MusicItem | null = null;

  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly httpService = inject(HttpService);
  private readonly toastr = inject(ToastrService);

  ngOnInit(): void {
    this.initUser();
    this.initFormGroup();
    this.refreshSubscriptions();
  }

  refreshSubscriptions(): void {
    this.subscriptionsLoading = true;

    this.httpService
      .getUserSubscriptions()
      .subscribe({
        next: (res: Array<any>) => {
          console.log('Subscriptions: ', res);
          this.userSubscriptions = res;
          this.sortMusicItemArray(this.userSubscriptions);
        },
        error: (err) => console.error(err),
      })
      .add(() => (this.subscriptionsLoading = false));
  }

  onSubmit(): void {
    this.queryLoading = true;
    this.emptyQuery = false;

    // Every time we submit a new query the number of matches should be reset
    this.queryMatches = new Array<MusicItem>();

    this.httpService.queryMusic(this.queryForm).subscribe({
      next: (res) => {
        if (res.body.length <= 0) {
          this.emptyQuery = true;
        }

        console.log("Results: ", res.body);
        this.queryResults = res.body;

        // Once we get results we update the matches, then map the query results to find those that are existing subscriptions
        this.updateQueryMatches();
        this.remapQueryResults();

        console.log('Query Matches: ', this.queryMatches);
      },
      error: (err) => console.error(err),
    })
    .add(() => (this.queryLoading = false));
  }

  // By subscribing, we add the musicItem to subscription results, update matches and re-map all query objects if any
  handleSubscribed(musicItem: MusicItem): void {
    this.httpService.addUserSubscription(musicItem).subscribe({
      next: () => {
        this.toastr.success(`Successfully Subscribed!`);
      },
      error: () => {
        this.toastr.error(`Failed to Subscribe...`);
      },
      complete: () => {
        this.userSubscriptions.push(musicItem); // Already guarded for duplicates so simply push
        this.sortMusicItemArray(this.userSubscriptions);
        this.updateQueryMatches();
        this.remapQueryResults();
      }
    })
    .add(() => {
      musicItem.processing = false;
      this.processedMusicItem = musicItem;
    })
  }

  // By unsubscribing, we remove the musicItem from the subscription results, update matches and re-map all query objects if any
  handleUnsubscribe(musicItem: MusicItem): void {
    this.httpService.deleteUserSubscription(musicItem).subscribe({
      next: () => {
        this.toastr.success(`Successfully Unsubscribed!`);
      },
      error: () => {
        this.toastr.error(`Failed to remove subscription...`);
      },
      complete: () => {
        // Filter to remove, same O(N) since still iterating through all subscriptions  
        this.userSubscriptions = this.userSubscriptions.filter(userSubscription => 
          userSubscription.title !== musicItem.title && 
          userSubscription.artist !== musicItem.artist && 
          userSubscription.year !== musicItem.year
        )
        this.sortMusicItemArray(this.userSubscriptions);
        this.updateQueryMatches();
        this.remapQueryResults();
      }
    })
    .add(() => {
      musicItem.processing = false;
      this.processedSubscriptionMusicItem = musicItem;
    })
  }

  private initUser(): void {
    const user = this.authService.getUser();
    if (user == null) {
      this.router.navigate(['/']);
    }

    this.currentUser = user;
  }

  private initFormGroup(): void {
    this.queryForm = this.fb.group({
      title: [''],
      artist: [''],
      year: [''],
    }) as FormGroup<QueryForm>;
  }

  private updateQueryMatches(): void {
    this.queryMatches = this.queryResults.filter((newResult: any) =>
      this.userSubscriptions.some(
        (existingResult: any) =>
          existingResult.title === newResult.title &&
          existingResult.artist === newResult.artist &&
          existingResult.year === newResult.year
      )
    );
  }

  private remapQueryResults(): void {
    this.queryResults.map((musicItem: MusicItem) => musicItem.subscribed = this.existingSubscription(musicItem));
    this.sortMusicItemArray(this.queryResults);
  }

  private existingSubscription(musicItem: MusicItem): boolean {
    return this.queryMatches.some(
      (existingResult: any) =>
        existingResult.title === musicItem.title &&
        existingResult.artist === musicItem.artist &&
        existingResult.year === musicItem.year
    );
  }

  private sortMusicItemArray(musicItemArray: Array<MusicItem>): void {
    musicItemArray.sort((a: any, b: any) => {
      const titleA = a.title.toUpperCase();
      const titleB = b.title.toUpperCase();
    
      return titleA < titleB ? -1 : (titleA > titleB ? 1 : 0);
    });
  }
}
