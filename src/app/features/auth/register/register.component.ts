import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {AuthService} from '../../../core/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(private router: Router,
              private fb: FormBuilder,
              private authService: AuthService) {
  }

  ngOnInit(): void {
    this.setRegisterForm();
  }

  setRegisterForm(): void {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contact: ['', [Validators.required, Validators.minLength(10)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      field: ['', Validators.required]
    });
  }

  isTouchedAndInvalid(controlName: string): boolean {
    const control = this.registerForm.get(controlName);
    return control?.touched && control?.invalid || false;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const formData = this.registerForm.value;

      const payload = {
        name: formData.firstName,
        contact: formData.contact,
        surname: formData.lastName,
        email: formData.email,
        password: formData.password,
        field: formData.field
      };

      this.authService.register(payload).subscribe({
        next: (res: any) => {
          this.navigateToLogin();
          alert('Account created successfully!');
          this.registerForm.reset();
        },
        error: (err: any) => {
          alert('Registration failed.');
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  private navigateToLogin(): void {
    this.router.navigate(['/login'], {
      queryParams: {email: this.registerForm.value?.email}
    });
  }
}
