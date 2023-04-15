import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';

import { PostsComponent } from './posts/posts.component';
import { HeaderComponent } from './header/header.component';
import { PostEditComponent } from './posts/post-edit/post-edit.component';

@NgModule({
	declarations: [
		AppComponent,
		HeaderComponent,
		PostsComponent,
		PostEditComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		ReactiveFormsModule,

		MatCardModule,
		MatInputModule,
		MatButtonModule,
		MatDividerModule,
		MatToolbarModule,
		MatFormFieldModule,
		MatExpansionModule,
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
