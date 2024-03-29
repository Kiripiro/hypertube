import { Component, OnInit } from '@angular/core';
import { LocalStorageService, localStorageName } from '../services/local-storage.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from 'src/app/services/dialog.service';
import { MoviesService } from '../services/movie.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss', '../app.component.scss']
})
export class ProfileComponent implements OnInit {

  username = "";
  userInfos: any;
  loading = true;
  error = false;
  personalProfil = false;
  private id: number;
  movieHistory: [] = [];

  constructor(
    private localStorageService: LocalStorageService,
    private authService: AuthService,
    private movieService: MoviesService,
    private dialogService: DialogService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.id = this.localStorageService.getItem(localStorageName.id);
    if (!this.authService.checkLog()) {
      this.router.navigate(['auth/login']);
      return;
    }
    this.loading = true;
    this.error = false;
    this.route.params.subscribe(params => {
      this.username = params['username'];
      if (this.username == "") {
        this.error = true;
      }
      this.authService.getUserInfos(this.username).subscribe({
        next: (response) => {
          this.userInfos = response.user;
          this.personalProfil = this.userInfos.id == this.id;
          if (this.userInfos.avatar && this.userInfos.avatar.includes("http") || this.userInfos.avatar.includes("https")) {
            this.userInfos.avatar = this.userInfos.avatar;
          } else {
            this.userInfos.avatar = "data:image/png;base64," + this.userInfos.avatar;
          }
          this.loading = false;
          if (this.personalProfil) {
            this.movieService.getMovieHistory().subscribe({
              next: (response) => {
                this.movieHistory = response.movieHistory.map((movie: any) => { return movie.title });
              },
              error: (error) => {
              }
            });
          } else {
            this.movieService.getMovieHistoryById(this.userInfos.id).subscribe({
              next: (response) => {
                this.movieHistory = response.movieHistory.map((movie: any) => { return movie.title });
              },
              error: (error) => {
              }
            });
          }
        },
        error: (error) => {
          if (error.message == "User not found")
            this.error = true;
          else {
            const dialogData = {
              title: "Error",
              content: "An error occured, please try again later",
              positive: "Ok",
              negative: "",
              action: "error"
            };
            this.dialogService.openDialog(dialogData);
          }
        }
      });
    });

  }

  ngOnInit(): void {
    if (!this.authService.checkLog()) {
      this.router.navigate(['auth/login']);
      return;
    }
  }
}
