import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm = new FormGroup({
    name: new FormControl('', Validators.required),
    // lastName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    role: new FormControl('', Validators.required), 
  });

  constructor(private userService:  UserService) { }

  get isFormValid() {
    return this.registerForm.valid;
  }

   
onSubmit(): void {
  if (this.registerForm.valid) {
    const { name, email, password, role } = this.registerForm.value;
    const userData = {
     name: name!, 
     email: email!,
     password: password!,
     role: role!,
};


    this.userService.registerUser(userData).subscribe({
      next: (response) => {
        console.log('משתמש נרשם בהצלחה:', response);
        alert('נרשמת בהצלחה!');
      },
      error: (err) => {
        console.error('שגיאה בהרשמה:', err);
        alert('הרשמה נכשלה, אנא נסה שוב.');
      },
    });
  }
  else {
    this.registerForm.markAllAsTouched();
    console.log('הטופס לא תקין');
  }
}
}