import {
	ChangeDetectionStrategy,
	Component,
	OnInit,
	inject,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute } from '@angular/router';
import { filter, switchMap, tap } from 'rxjs';

@Component({
	selector: 'app-post-edit',
	templateUrl: './post-edit.component.html',
	styleUrls: ['./post-edit.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostEditComponent implements OnInit {
	isLoading: boolean = false;

	postForm = new FormGroup({
		id: new FormControl<string | null>(null),
		title: new FormControl<string | null>(null, {
			validators: [Validators.required],
		}),
		content: new FormControl<string | null>(null, {
			validators: [Validators.required],
		}),
	});

	isEditMode: boolean = false;
	private postId: string | null = null;

	private route = inject(ActivatedRoute);
	private postsService = inject(PostsService);

	ngOnInit(): void {
		this.route.paramMap
			.pipe(
				tap((params) => {
					if (params.has('postId')) {
						this.isEditMode = true;
						this.postId = params.get('postId')!;
					} else {
						this.isEditMode = false;
						this.postId = null;
					}
				}),
				filter((_) => this.isEditMode),
				switchMap((_) => {
					this.isLoading = true;
					return this.postsService.fetchPost(this.postId!).pipe(
						tap((response) => {
							this.isLoading = false;
							this.postForm.setValue({
								id: response.id,
								title: response.title,
								content: response.content,
							});
						})
					);
				})
			)
			.subscribe();
	}

	onSubmitPost() {
		if (this.postForm.valid) {
			this.isLoading = true;
			if (this.isEditMode) {
				this.postsService.updatePost(
					this.postForm.value.id!,
					this.postForm.value.title!,
					this.postForm.value.content!
				);
			} else {
				this.postsService.createPost(
					this.postForm.value.title!,
					this.postForm.value.content!
				);
			}
			this.postForm.reset();
		}
	}
	// llOqvWR4HesCKm5K
}
