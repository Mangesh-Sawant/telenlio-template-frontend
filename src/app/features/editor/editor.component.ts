// FILE: src/app/features/editor/editor.component.ts

import {AfterViewInit, Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {SafeHtmlPipe} from '../../core/safe-html.pipe';
import {TemplateService} from './services/template.service';
import {Template} from './models/template';
import {Subject} from 'rxjs';
import {finalize, takeUntil} from 'rxjs/operators';

// Imports for Nunjucks, CodeMirror, and Prettier...
import * as nunjucks from 'nunjucks';
import * as CodeMirror from 'codemirror';
import * as prettier from "prettier/standalone";
import * as prettierPluginHtml from "prettier/plugins/html";
import prettierPluginEstree from "prettier/plugins/estree";
import * as prettierPluginBabel from "prettier/plugins/babel";


@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SafeHtmlPipe],
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('htmlEditor') htmlEditorRef!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('cssEditor') cssEditorRef!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('jsonEditor') jsonEditorRef!: ElementRef<HTMLTextAreaElement>;

  // A subject to manage component destruction and prevent memory leaks
  private destroy$ = new Subject<void>();

  // Component State
  isEditMode = false;
  isDownloadingPdf = false; // For the download button's loading state
  templateId: string | null = null;
  templateName: string = "New Template";
  activeTab: 'html' | 'css' | 'json' = 'html';
  viewMode: 'default' | 'preview' | 'fullscreen' = 'default';

  // CodeMirror editor instances
  private cmHtml?: CodeMirror.Editor;
  private cmCss?: CodeMirror.Editor;
  private cmJson?: CodeMirror.Editor;

  // Content state variables
  htmlContent: string = '';
  cssContent: string = '';
  jsonData: string = '{}';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private templateService: TemplateService,
    private zone: NgZone // Inject NgZone to manage change detection from CodeMirror
  ) {
  }

  // --- Angular Lifecycle Hooks ---

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const id = params.get('id');
      if (id && id !== 'new') {
        this.isEditMode = true;
        this.templateId = id;
        this.loadTemplateData(id);
      } else {
        const example = localStorage.getItem('example_template');
        if (example) {
          const data = JSON.parse(example);
          this.templateName = data.title;
          this.htmlContent = data.html;
          this.cssContent = data.css;
          this.jsonData = JSON.stringify(data.example_data, null, 2);
          localStorage.removeItem('example_template');
        } else {
          this.isEditMode = false;
          this.templateId = null;
          this.templateName = "New Template";
          this.htmlContent = `<h1>Welcome, {{ user.name }}!</h1>\n<p>Your account is ready.</p>`;
          this.cssContent = `body {\n  font-family: sans-serif;\n  color: #333;\n}`;
          this.jsonData = `{ \n  "user": {\n    "name": "Alex"\n  }\n}`;
          this.updateEditorsFromState();
        }
      }
    });
  }

  ngAfterViewInit(): void {
    this.initializeEditors();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // --- Data Loading and Saving ---

  loadTemplateData(id: string): void {
    this.templateService.getTemplateById(id).subscribe({
      next: (template: Template) => {
        this.templateName = template.title;
        this.htmlContent = template.html;
        this.cssContent = template.css;
        this.jsonData = JSON.stringify(template.example_data, null, 2);
        this.updateEditorsFromState();
      },
      error: (err) => {
        console.error("Failed to load template", err);
        alert("Could not load the requested template.");
        this.router.navigate(['/dashboard']);
      }
    });
  }

  async saveTemplate(): Promise<void> {
    let exampleData;
    try {
      exampleData = JSON.parse(this.jsonData);
    } catch (e) {
      alert("The JSON data is invalid. Please fix it before saving.");
      return;
    }

    const templateData = {
      title: this.templateName,
      html: this.htmlContent,
      css: this.cssContent,
      example_data: exampleData,
    };

    if (this.isEditMode && this.templateId) {
      this.templateService.updateTemplate(this.templateId, templateData).subscribe({
        next: () => alert('Template updated successfully!'),
        error: (err) => alert(`Failed to update template: ${err.error.detail || err.message}`)
      });
    } else {
      this.templateService.createTemplate(templateData).subscribe({
        next: (response) => {
          alert('Template created successfully!');
          this.router.navigate(['/editor', response.template_id]);
        },
        error: (err) => alert(`Failed to create template: ${err.error.detail || err.message}`)
      });
    }
  }

  downloadPdf(): void {
    if (!this.isEditMode || !this.templateId) {
      alert('Please save the template before downloading a PDF.');
      return;
    }

    let dataContext;
    try {
      dataContext = JSON.parse(this.jsonData);
    } catch (e) {
      alert('The JSON data is invalid. Please fix it before downloading.');
      return;
    }

    this.isDownloadingPdf = true;
    this.templateService.renderPdf(this.templateId, dataContext)
      .pipe(
        finalize(() => this.isDownloadingPdf = false)
      )
      .subscribe({
        next: (pdfBlob: Blob) => {
          const url = window.URL.createObjectURL(pdfBlob);
          const a = document.createElement('a');
          document.body.appendChild(a);
          a.style.display = 'none';
          a.href = url;
          a.download = `${this.templateName || 'template'}.pdf`;
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        },
        error: (err) => {
          console.error('PDF download failed', err);
          alert('Failed to generate PDF. Please check the console for details.');
        }
      });
  }

  // --- Editor Initialization and Management ---

  private initializeEditors(): void {
    // HTML Editor
    this.cmHtml = CodeMirror.fromTextArea(this.htmlEditorRef.nativeElement, {
      mode: 'jinja2', lineNumbers: true, theme: 'default', autoCloseBrackets: true
    });
    this.cmHtml.setValue(this.htmlContent);
    this.cmHtml.on('change', (cm) => this.zone.run(() => {
      this.htmlContent = cm.getValue();
    }));

    // CSS Editor
    this.cmCss = CodeMirror.fromTextArea(this.cssEditorRef.nativeElement, {
      mode: 'css', lineNumbers: true, theme: 'default', autoCloseBrackets: true
    });
    this.cmCss.setValue(this.cssContent);
    this.cmCss.on('change', (cm) => this.zone.run(() => {
      this.cssContent = cm.getValue();
    }));

    // JSON Editor
    this.cmJson = CodeMirror.fromTextArea(this.jsonEditorRef.nativeElement, {
      mode: {name: 'javascript', json: true}, lineNumbers: true, theme: 'default', autoCloseBrackets: true
    });
    this.cmJson.setValue(this.jsonData);
    this.cmJson.on('change', (cm) => this.zone.run(() => {
      this.jsonData = cm.getValue();
    }));
  }

  private updateEditorsFromState(): void {
    if (this.cmHtml) this.cmHtml.setValue(this.htmlContent);
    if (this.cmCss) this.cmCss.setValue(this.cssContent);
    if (this.cmJson) this.cmJson.setValue(this.jsonData);
  }

  setActiveTab(tab: 'html' | 'css' | 'json'): void {
    this.activeTab = tab;
    this.refreshAllEditors();
  }

  // --- Editor Actions ---

  async formatCode(): Promise<void> {
    const editor = this.getActiveEditor();
    if (!editor) return;
    const code = editor.getValue();
    let parser: string;
    switch (this.activeTab) {
      case 'html':
        parser = 'html';
        break;
      case 'css':
        parser = 'css';
        break;
      case 'json':
        parser = 'json';
        break;
      default:
        return;
    }
    try {
      const formattedCode = await prettier.format(code, {
        parser: parser,
        plugins: [prettierPluginHtml, prettierPluginEstree, prettierPluginBabel],
        printWidth: 100,
      });
      editor.setValue(formattedCode);
    } catch (error) {
      console.error("Could not format code:", error);
      alert("Could not format the code. Check the console for details.");
    }
  }

  undo(): void {
    this.getActiveEditor()?.undo();
  }

  clearCode(): void {
    this.getActiveEditor()?.setValue('');
  }

  private getActiveEditor(): CodeMirror.Editor | undefined {
    switch (this.activeTab) {
      case 'html':
        return this.cmHtml;
      case 'css':
        return this.cmCss;
      case 'json':
        return this.cmJson;
      default:
        return undefined;
    }
  }

  // --- View and Layout Management ---

  togglePreview(): void {
    this.viewMode = this.viewMode === 'preview' ? 'default' : 'preview';
    this.refreshAllEditors();
  }

  toggleFullscreen(): void {
    this.viewMode = this.viewMode === 'fullscreen' ? 'default' : 'fullscreen';
    this.refreshAllEditors();
  }

  navigateToDocument(): void {
    this.router.navigate(['/document']);
  }

  // --- Live Preview Rendering ---

  get livePreviewContent(): string {
    let finalHtml = '';
    try {
      const dataContext = JSON.parse(this.jsonData);
      finalHtml = nunjucks.renderString(this.htmlContent, dataContext);
    } catch (e) {
      const errorMessage = (e instanceof Error) ? e.message : String(e);
      finalHtml = `<div style="color: red; background: #fff1f1; border: 1px solid red; font-family: sans-serif; padding: 20px;"><h3>Error Rendering Template</h3><pre>${errorMessage}</pre></div>`;
    }
    return `<html><head><style>${this.cssContent}</style></head><body>${finalHtml}</body></html>`;
  }

  private refreshAllEditors(): void {
    setTimeout(() => {
      this.cmHtml?.refresh();
      this.cmCss?.refresh();
      this.cmJson?.refresh();
    }, 10);
  }
}
