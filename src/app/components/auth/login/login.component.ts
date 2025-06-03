import { Component, computed, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgIf, RouterModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private fb: FormBuilder
  ) {}

 ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

 avatarInitial = computed(() => { 
    const name = this.authService.userName(); 
    return name ? name.charAt(0).toUpperCase() : '';
  });


 onSubmit(): void {
  if (this.loginForm.valid) {
    const { email, password } = this.loginForm.value;

    this.authService.login(email!, password!).subscribe({
      next: () => {
        alert('נרשמתה בהצלחה!');
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('שגיאה בהתחברות:', err);
        alert('התחברות נכשלה');
      }
    });
  }
}

  logout(): void {
    this.authService.logout();
  }
}