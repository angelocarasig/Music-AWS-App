import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LoginForm } from '../../models/login';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loading = false;
  loginForm: FormGroup<LoginForm>;
  
  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    }) as FormGroup<LoginForm>;
  }

  onSubmit(): void {
    console.log(this.loginForm.value);

    this.loading = true;
    setTimeout(() => {
      this.loading = false;
      
    }, 3000);
  }
}
