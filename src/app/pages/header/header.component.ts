import { Component, computed } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgIf, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

username = computed(() => this.authService.userName());
userRole = computed(() => this.authService.userRole());
isLoggedIn = computed(() => this.authService.isAuthenticated());

avatarInitial = computed(() => {
  const name = this.username();
  return name ? name.charAt(0).toUpperCase() : '';
});


  constructor(private authService: AuthService, private router: Router) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
