import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'safeHtml',
  standalone: true
})
export class SafeHtmlPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string): SafeHtml {
    // This tells Angular that the provided HTML is safe to render.
    // Use this with caution and only on content you trust.
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
}
