import { Component, AfterViewInit, ViewChild, ElementRef, HostBinding, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SafeHtmlPipe } from '../../core/safe-html.pipe'; // Please verify this path
import { TemplateService } from './services/template.service'; // Please verify this path
import { Template } from './models/template'; // Please verify this path

// Imports for Nunjucks, CodeMirror, and Prettier
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
export class EditorComponent implements OnInit, AfterViewInit {
  @ViewChild('htmlEditor') htmlEditorRef!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('cssEditor') cssEditorRef!: ElementRef<HTMLTextAreaElement>;
  // CORRECTED: @Viewchild -> @ViewChild
  @ViewChild('jsonEditor') jsonEditorRef!: ElementRef<HTMLTextAreaElement>;

  isEditMode = false;
  templateId: string | null = null;

  private cmHtml: CodeMirror.Editor | undefined;
  private cmCss: CodeMirror.Editor | undefined;
  private cmJson: CodeMirror.Editor | undefined;

  templateName: string = "New Template";
  activeTab: 'html' | 'css' | 'json' = 'html';

  @HostBinding('class')
  viewMode: 'default' | 'preview' | 'fullscreen' = 'default';

  // Internal component state
  htmlContent: string = `<h1>Welcome, {{ user.name }}!</h1>`;
  cssContent: string = `body { font-family: sans-serif; color: #333; }`;
  jsonData: string = `{ "user": { "name": "Alex" } }`; // JSON data is kept as a string for the editor

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private templateService: TemplateService
  ) {}

  ngOnInit(): void {
    this.templateId = this.route.snapshot.paramMap.get('id');
    if (this.templateId && this.templateId !== 'new') {
      this.isEditMode = true;
      this.loadTemplateData(this.templateId);
    } else {
      this.isEditMode = false;
      this.templateName = "New Template";
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.initializeEditors(true), 0);
  }

  loadTemplateData(id: string): void {
    this.templateService.getTemplateById(id).subscribe({
      next: (template: Template) => {
        this.templateName = template.title;
        this.htmlContent = template.html;
        this.cssContent = template.css;
        this.jsonData = JSON.stringify(template.example_data, null, 2);

        // setValue can be called even if editors aren't fully ready
        this.cmHtml?.setValue(this.htmlContent);
        this.cmCss?.setValue(this.cssContent);
        this.cmJson?.setValue(this.jsonData);
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

  private initializeEditors(initialLoad = false): void {
    if (initialLoad) {
      this.initializeHtmlEditor();
      this.initializeCssEditor();
      this.initializeJsonEditor();
    }
  }

  setActiveTab(tab: 'html' | 'css' | 'json'): void {
    this.activeTab = tab;
    setTimeout(() => {
      this.cmHtml?.refresh();
      this.cmCss?.refresh();
      this.cmJson?.refresh();
    }, 1);
  }

  async formatCode(): Promise<void> {
    const editor = this.getActiveEditor();
    if (!editor) return;
    const code = editor.getValue();
    let parser: string;
    switch (this.activeTab) {
      case 'html': parser = 'html'; break;
      case 'css': parser = 'css'; break;
      case 'json': parser = 'json'; break;
      default: return;
    }
    try {
      const formattedCode = await prettier.format(code, {
        parser: parser,
        plugins: [prettierPluginHtml, prettierPluginEstree, prettierPluginBabel],
        printWidth: 100,
      });
      editor.setValue(formattedCode);
    } catch (error) { console.error("Could not format code:", error); }
  }

  private getActiveEditor(): CodeMirror.Editor | undefined {
    switch (this.activeTab) {
      case 'html': return this.cmHtml;
      case 'css': return this.cmCss;
      case 'json': return this.cmJson;
      default: return undefined;
    }
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

  private initializeHtmlEditor(): void {
    if (!this.cmHtml) {
      this.cmHtml = CodeMirror.fromTextArea(this.htmlEditorRef.nativeElement, {
        mode: 'jinja2', lineNumbers: true, theme: 'default', autoCloseBrackets: true
      });
      this.cmHtml.on('change', (cm) => this.htmlContent = cm.getValue());
    }
    this.cmHtml.refresh();
  }

  private initializeCssEditor(): void {
    if (!this.cmCss) {
      this.cmCss = CodeMirror.fromTextArea(this.cssEditorRef.nativeElement, {
        mode: 'css', lineNumbers: true, theme: 'default', autoCloseBrackets: true
      });
      this.cmCss.on('change', (cm) => this.cssContent = cm.getValue());
    }
    this.cmCss.refresh();
  }

  private initializeJsonEditor(): void {
    if (!this.cmJson) {
      this.cmJson = CodeMirror.fromTextArea(this.jsonEditorRef.nativeElement, {
        mode: { name: 'javascript', json: true }, lineNumbers: true, theme: 'default', autoCloseBrackets: true
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
