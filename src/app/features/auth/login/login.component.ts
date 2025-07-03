// FILE: src/app/login/login.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
// Import Router and RouterLink
import { Router, RouterLink } from '@angular/router';
import {AuthService} from '../../../core/auth.service';
// Import your AuthService

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  // Inject AuthService and Router into the constructor
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['mango@gmail.com', [Validators.required, Validators.email]],
      password: ['pass', [Validators.required]]
    });
  }

  onSubmit(): void {
    // Make sure the form is valid before proceeding
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    // Get email and password from the form
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    console.log('Attempting to log in with:', { email, password });

    // Call the AuthService's login method
    this.authService.login(email, password).subscribe({
      next: (response:any) => {
        // This block runs on successful login
        console.log('Login successful!', response);
        // The token has been saved by the tap() operator in the service.
        // Now, navigate the user to the dashboard.
        this.router.navigate(['/dashboard']);
      },
      error: (err:any) => {
        // This block runs if the API returns an error (e.g., 400 for bad credentials)
        console.error('Login failed:', err);
        // Here you could show an error message to the user
        alert('Login failed. Please check your email and password.');
      }
    });
  }
}
