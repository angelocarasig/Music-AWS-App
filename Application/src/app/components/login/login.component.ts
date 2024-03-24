import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LoginForm } from '../../models/login';
import { LoginService } from '../../services/login.service';
import { HttpErrorResponse } from '@angular/common/http';

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

  serverSuccessMessage: string | null = null;
  serverErrorMessage: string | null = null;
  
  private readonly fb = inject(FormBuilder);
  private readonly loginService = inject(LoginService);
  private readonly router = inject(Router);
  
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    }) as FormGroup<LoginForm>;
  }

  onSubmit(): void {
    this.loading = true;

    this.serverErrorMessage = null;
    this.serverSuccessMessage = null;
    
    this.loginService.loginUser(this.loginForm).subscribe({
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
