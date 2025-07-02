import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

// Import Nunjucks and CodeMirror
import * as nunjucks from 'nunjucks';
import * as CodeMirror from 'codemirror';

// Import CodeMirror modes for syntax highlighting
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/css/css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/jinja2/jinja2';
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

  htmlContent: string = `<h1>Invoice #{{ invoice.number }}</h1>
<p><strong>Billed to:</strong> {{ customer.name }}</p>

<h2>Items:</h2>
<ul>
  {% for item in items %}
    <li>{{ item.name }} - \${{ item.price }}</li>
  {% endfor %}
</ul>

<p><strong>Total: \${{ total }}</strong></p>
`;

  cssContent: string = `body { font-family: sans-serif; }
ul { list-style-type: none; padding: 0; }
li { border-bottom: 1px solid #eee; padding: 5px 0; }
`;

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
    // On load, only initialize the editor for the default active tab.
    this.initializeHtmlEditor();
  }

  setActiveTab(tab: 'html' | 'css' | 'json'): void {
    this.activeTab = tab;

    // Use a timeout to ensure the DOM has updated and the container is visible
    // before we initialize the editor for the first time or refresh it.
    setTimeout(() => {
      switch (tab) {
        case 'html':
          this.initializeHtmlEditor();
          break;
        case 'css':
          this.initializeCssEditor();
          break;
        case 'json':
          this.initializeJsonEditor();
          break;
      }
    }, 1);
  }

  private initializeHtmlEditor() {
    if (!this.cmHtml) { // LAZY INITIALIZATION: Only create if it doesn't exist
      this.cmHtml = CodeMirror.fromTextArea(this.htmlEditorRef.nativeElement, {
        mode: 'jinja2', lineNumbers: true, theme: 'default'
      });
      this.cmHtml.on('change', (cm) => this.htmlContent = cm.getValue());
    }
    this.cmHtml.refresh(); // Always refresh to ensure it's drawn correctly
  }

  private initializeCssEditor() {
    if (!this.cmCss) { // LAZY INITIALIZATION
      this.cmCss = CodeMirror.fromTextArea(this.cssEditorRef.nativeElement, {
        mode: 'css', lineNumbers: true, theme: 'default'
      });
      this.cmCss.on('change', (cm) => this.cssContent = cm.getValue());
    }
    this.cmCss.refresh();
  }

  private initializeJsonEditor() {
    if (!this.cmJson) { // LAZY INITIALIZATION
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
