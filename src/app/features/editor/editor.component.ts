import { Component, AfterViewInit, ViewChild, ElementRef, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Import Nunjucks and the CodeMirror type. All other imports are now in main.ts
import * as nunjucks from 'nunjucks';
import * as CodeMirror from 'codemirror';
import {SafeHtmlPipe} from '../../core/safe-html.pipe';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SafeHtmlPipe],
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements AfterViewInit {
  @ViewChild('htmlEditor') htmlEditorRef!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('cssEditor') cssEditorRef!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('jsonEditor') jsonEditorRef!: ElementRef<HTMLTextAreaElement>;

  private cmHtml: CodeMirror.Editor | undefined;
  private cmCss: CodeMirror.Editor | undefined;
  private cmJson: CodeMirror.Editor | undefined;

  templateName: string = "Invoice Template";
  activeTab: 'html' | 'css' | 'json' = 'html';

  @HostBinding('class')
  viewMode: 'default' | 'preview' | 'fullscreen' = 'default';

  htmlContent: string = `<h1>Invoice #{{ invoice.number }}</h1>
<p><strong>Billed to:</strong> {{ customer.name }}</p>
<h2>Items:</h2>
<ul>
  {% for item in items %}
    <li>{{ item.name }} - \${{ item.price }}</li>
  {% endfor %}
</ul>
<p><strong>Total: \${{ total }}</strong></p>`;
  cssContent: string = `body { font-family: sans-serif; }
ul { list-style-type: none; padding: 0; }
li { border-bottom: 1px solid #eee; padding: 5px 0; }`;
  jsonData: string = `{
  "invoice": { "number": "2024-001" },
  "customer": { "name": "ACME Corp" },
  "items": [
    { "name": "Product A", "price": 100 },
    { "name": "Product B", "price": 150 },
    { "name": "Service C", "price": 250 }
  ],
  "total": 500
}`;

  ngAfterViewInit(): void {
    setTimeout(() => this.initializeHtmlEditor(), 0);
  }

  setActiveTab(tab: 'html' | 'css' | 'json'): void {
    this.activeTab = tab;
    setTimeout(() => {
      switch (tab) {
        case 'html': this.initializeHtmlEditor(); break;
        case 'css': this.initializeCssEditor(); break;
        case 'json': this.initializeJsonEditor(); break;
      }
    }, 1);
  }

  private getActiveEditor(): CodeMirror.Editor | undefined {
    switch (this.activeTab) {
      case 'html': return this.cmHtml;
      case 'css': return this.cmCss;
      case 'json': return this.cmJson;
      default: return undefined;
    }
  }

  formatCode(): void {
    const editor = this.getActiveEditor();
    if (!editor) return;
    const totalLines = editor.lineCount();
    (editor as any).autoFormatRange({ line: 0, ch: 0 }, { line: totalLines });
  }

  undo(): void { this.getActiveEditor()?.undo(); }
  clearCode(): void { this.getActiveEditor()?.setValue(''); }

  togglePreview(): void {
    this.viewMode = this.viewMode === 'preview' ? 'default' : 'preview';
    this.refreshAllEditors();
  }

  toggleFullscreen(): void {
    this.viewMode = this.viewMode === 'fullscreen' ? 'default' : 'fullscreen';
    this.refreshAllEditors();
  }

  private refreshAllEditors(): void {
    setTimeout(() => {
      this.cmHtml?.refresh();
      this.cmCss?.refresh();
      this.cmJson?.refresh();
    }, 250);
  }

  private initializeHtmlEditor() {
    if (!this.cmHtml) {
      this.cmHtml = CodeMirror.fromTextArea(this.htmlEditorRef.nativeElement, {
        mode: 'jinja2', lineNumbers: true, theme: 'default'
      });
      this.cmHtml.on('change', (cm) => this.htmlContent = cm.getValue());
    }
    this.cmHtml.refresh();
  }

  private initializeCssEditor() {
    if (!this.cmCss) {
      this.cmCss = CodeMirror.fromTextArea(this.cssEditorRef.nativeElement, {
        mode: 'css', lineNumbers: true, theme: 'default'
      });
      this.cmCss.on('change', (cm) => this.cssContent = cm.getValue());
    }
    this.cmCss.refresh();
  }

  private initializeJsonEditor() {
    if (!this.cmJson) {
      this.cmJson = CodeMirror.fromTextArea(this.jsonEditorRef.nativeElement, {
        mode: { name: 'javascript', json: true }, lineNumbers: true, theme: 'default'
      });
      this.cmJson.on('change', (cm) => this.jsonData = cm.getValue());
    }
    this.cmJson.refresh();
  }

  get livePreviewContent(): string {
    let finalHtml = '';
    try {
      const dataContext = JSON.parse(this.jsonData);
      finalHtml = nunjucks.renderString(this.htmlContent, dataContext);
    } catch (e) {
      finalHtml = `<div style="color: red; font-family: sans-serif; padding: 20px;"><h3>Error Rendering Template</h3><pre>${(e as Error).message}</pre></div>`;
    }
    return `<html><head><style>${this.cssContent}</style></head><body>${finalHtml}</body></html>`;
  }
}
