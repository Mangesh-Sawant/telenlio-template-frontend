// FILE: src/app/login/login.component.ts

import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
// Import Router and RouterLink
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
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

  constructor(private route: ActivatedRoute,
              private fb: FormBuilder,
              private authService: AuthService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.getLoginForm();
    this.getEmailFromRoute();
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;
    this.authService.login({email, password}).subscribe({
      next: (response: any) => {
        this.router.navigate(['/dashboard']);
      },
      error: (err: any) => {
        alert('Login failed. Please check your email and password.');
      }
    });
  }

  private getEmailFromRoute(): void {
    this.route.queryParams.subscribe((params: { [x: string]: any; }) => {
      const emailFromQuery = params['email'];
      if (emailFromQuery) {
        this.loginForm.patchValue({email: emailFromQuery});
      }
    });
  }

  private getLoginForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }
}
