import { Component, ViewChildren, QueryList, ElementRef } from '@angular/core';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  imports: [
    RouterLink
  ],
  styleUrls: ['./document.component.scss']
})
export class DocumentComponent {
  @ViewChildren('code0, code1, code2, code3') codeBlocks!: QueryList<ElementRef>;

  constructor(private router: Router) {
  }

  copyCode(index: number) {
    const codeElement = this.codeBlocks.toArray()[index].nativeElement;
    const text = codeElement.textContent;
    navigator.clipboard.writeText(text).then(() => {
      alert('Code copied!');
    });
  }
}
