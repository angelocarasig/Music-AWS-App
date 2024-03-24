import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SignupForm } from '../../models/signup';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit {
  loading = false;
  signupForm: FormGroup<SignupForm>;

  private readonly fb = inject(FormBuilder);
  private readonly loginService = inject(LoginService);
  
  ngOnInit(): void {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      user_name: ['', [Validators.required]],
      password: ['', [Validators.required]],
    }) as FormGroup<SignupForm>;
  }

  onSubmit(): void {
    console.log(this.signupForm.value);

    this.loading = true;
    
    this.loginService.registerUser(this.signupForm).subscribe({
      next: (response) => console.log(response),
    }).add(() => this.loading = false);
  }
}
