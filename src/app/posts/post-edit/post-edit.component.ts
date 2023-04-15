import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PostsService } from '../posts.service';

@Component({
	selector: 'app-post-edit',
	templateUrl: './post-edit.component.html',
	styleUrls: ['./post-edit.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostEditComponent {
	postForm = new FormGroup({
		postId: new FormControl(null),
		postTitle: new FormControl('', { validators: [Validators.required] }),
		postContent: new FormControl('', { validators: [Validators.required] }),
	});

	constructor(private postsService: PostsService) {}

	onSubmitPost() {
		console.log(this.postForm.value, this.postForm.invalid);
		if (this.postForm.valid) {
			this.postsService.createPost(
				this.postForm.value.postTitle!,
				this.postForm.value.postContent!
			);
			this.postForm.reset();
		}
	}
}
