import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {SafeHtmlPipe} from '../../core/safe-html.pipe';
import {RouterLink} from '@angular/router'; // <-- Import for ngModel

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,     // <-- Add to imports
    SafeHtmlPipe,
    SafeHtmlPipe,
    RouterLink,
    // <-- Add to imports
  ],
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent {
  templateName: string = "Invoice Template";

  // The content for the HTML editor, bound with ngModel
  htmlContent: string = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { text-align: center; margin-bottom: 30px; }
        .invoice-details { margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .total { font-weight: bold; }
    </style>
</head>
<body>
    <div class="header">
        <h1>INVOICE</h1>
        <p>Invoice #: 001</p>
        <p>Date: January 15, 2024</p>
    </div>

    <div class="invoice-details">
        <p><strong>Bill To:</strong><br>
        Customer Name<br>
        123 Main Street<br>
        City, State 12345</p>
    </div>

    <table>
      <!-- Table content would go here -->
    </table>
</body>
</html>`;
}
