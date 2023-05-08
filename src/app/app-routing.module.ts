import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostsComponent } from './posts/posts.component';
import { PostEditComponent } from './posts/post-edit/post-edit.component';

const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		component: PostsComponent,
	},
	{
		path: 'create',
		component: PostEditComponent,
	},
	{
		path: 'edit/:postId',
		component: PostEditComponent,
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
