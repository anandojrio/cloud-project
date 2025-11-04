// In your homepage.component.ts
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-page',
  templateUrl: './homepage.html',
  styleUrls: ['./homepage.css'],
  imports:[CommonModule]
})
export class HomePageComponent {
  currentUser$: Observable<User | null>;
  constructor(public authService: AuthService) {
    this.currentUser$ = this.authService.currentUser$;
  }
}
