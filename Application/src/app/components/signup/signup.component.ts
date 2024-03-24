import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SignupForm } from '../../models/signup';
import { LoginService } from '../../services/login.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit {
  loading = false;
  serverSuccessMessage: string | null = null;
  serverErrorMessage: string | null = null;

  signupForm: FormGroup<SignupForm>;

  private readonly fb = inject(FormBuilder);
  private readonly loginService = inject(LoginService);
  private readonly router = inject(Router);
  
  ngOnInit(): void {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      user_name: ['', [Validators.required]],
      password: ['', [Validators.required]],
    }) as FormGroup<SignupForm>;
  }

  onSubmit(): void {
    this.loading = true;
    
    this.serverErrorMessage = null;
    this.serverSuccessMessage = null;

    this.loginService.registerUser(this.signupForm).subscribe({
      next: (response) => {
        this.serverSuccessMessage = response.message;
        setTimeout(() => {this.router.navigate(["/dashboard"])}, 3000)
      },
      error: (response: HttpErrorResponse) => {
        this.serverErrorMessage = response.error.message;
      }
    }).add(() => this.loading = false);
  }
}
