import {bootstrapApplication} from '@angular/platform-browser';
import {provideRouter} from '@angular/router';
import {routes} from './app/app.routes';
import {AppComponent} from './app/app.component';
import {provideHttpClient} from '@angular/common/http';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/css/css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/jinja2/jinja2';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/trailingspace';

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes),
    provideHttpClient(),

  ]
});
