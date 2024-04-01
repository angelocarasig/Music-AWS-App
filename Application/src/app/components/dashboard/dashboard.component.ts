import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { QueryForm } from '../../models/query';
import { HttpService } from '../../services/http.service';
import { MusicItemComponent } from '../music-results/music-results.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MusicItemComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  userSubscriptions: Array<any> = [];
  subscriptionsLoading = false;

  queryResults = [
    {
      "year": "1981",
      "web_url": "https://raw.githubusercontent.com/davidpots/songnotes_cms/master/public/songs/5-john-lennon-watching-the-wheels",
      "artist": "John Lennon",
      "img_url": "https://raw.githubusercontent.com/davidpots/songnotes_cms/master/public/images/artists/JohnLennon.jpg",
      "title": "Watching the Wheels"
    }
  ]

  queryForm: FormGroup<QueryForm>;
  emptyQuery = false;
  queryLoading = false;

  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly httpService = inject(HttpService);

  ngOnInit(): void {
    this.initUser();
    this.initFormGroup();
    this.initSubscriptions();
  }

  onSubmit(): void {
    this.queryLoading = true;
    this.emptyQuery = false;

    this.httpService.queryMusic(this.queryForm).subscribe({
      next: (res) => {
        if (res.body.length <= 0) {
          this.emptyQuery = true;
        }
        console.log(res.body);
        this.queryResults = res.body;
      },
      error: (err) => console.error(err)
    }).add(() => this.queryLoading = false);
  }

  private initUser(): void {
    const user = this.authService.getUser();
    if (user == null) {
      this.router.navigate(["/"]);
    }

    this.currentUser = user;
  }

  private initFormGroup(): void {
    this.queryForm = this.fb.group({
      title: [''],
      artist: [''],
      year: ['']
    }) as FormGroup<QueryForm>;
  }

  private initSubscriptions(): void {
    this.subscriptionsLoading = true;

    this.httpService.getUserSubscriptions().subscribe({
      next: (res: Array<any>) => {
        this.userSubscriptions = [];
        res.forEach((subscription: string) => {
          // TODO: SHOULD BE RETRIEVING MUSIC ITEMS FROM MUSIC TABLE

          const parts = subscription.split('-');
          const musicItem = {
            title: parts.slice(0, parts.length - 2).join('-').replaceAll("_", " "),
            author: parts[parts.length - 2].replaceAll("_", " "),
            year: parts[parts.length - 1],
            img_url: `https://s3906344-cosc2626-a1-music.s3.amazonaws.com/${subscription}.jpg`
          };

          this.userSubscriptions.push(musicItem);
        })
        console.log("Subscriptions: ", this.userSubscriptions);
      },
      error: (err) => console.error(err)
    }).add(() => this.subscriptionsLoading = false);
  }
}

