import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {RouterLink} from '@angular/router';

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

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['mango@gmail.com', [Validators.required, Validators.email]],
      password: ['pass', [Validators.required]] // Pre-filled for visual matching
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      console.log('Login Form Submitted!', this.loginForm.value);
      // Handle login logic here
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
