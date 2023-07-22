import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	OnInit,
	inject,
} from '@angular/core';
import {
	AbstractControl,
	AsyncValidatorFn,
	FormControl,
	FormGroup,
	ValidationErrors,
	Validators,
} from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, filter, of, switchMap, tap } from 'rxjs';

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
			validators: [Validators.required, Validators.minLength(3)],
		}),
		content: new FormControl<string | null>(null, {
			validators: [Validators.required],
		}),
		image: new FormControl<File | string | null>(null, {
			validators: [Validators.required],
			asyncValidators: [this.fileTypeValidator()],
		}),
	});

	isEditMode: boolean = false;
	imagePreview: string = '';

	private postId: string | null = null;

	private route = inject(ActivatedRoute);
	private cdr = inject(ChangeDetectorRef);
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
								image: response.imagePath,
							});
							this.imagePreview = response.imagePath;
						})
					);
				})
			)
			.subscribe();
	}

	onImageSelected(event: Event) {
		const fileList = (event.target as HTMLInputElement).files;
		if (fileList && fileList.length > 0) {
			const file: File = fileList[0];
			this.postForm.patchValue({ image: file });
			this.postForm.controls.image.updateValueAndValidity();
			const reader = new FileReader();
			reader.onload = () => {
				this.imagePreview = reader.result as string;
				this.cdr.markForCheck();
			};
			reader.readAsDataURL(file);
		}
	}

	private fileTypeValidator(): AsyncValidatorFn {
		return (
			control: AbstractControl
		): Observable<ValidationErrors | null> => {
			if (typeof control.value === 'string') {
				return of(null);
			}
			const file: File = control.value as File;
			const fileReader = new FileReader();
			const frObs: Observable<ValidationErrors | null> = new Observable(
				(observer) => {
					fileReader.addEventListener('loadend', () => {
						const arr = new Uint8Array(
							fileReader.result as ArrayBuffer
						).subarray(0, 4);
						let header: string = '';
						let isValid: boolean = false;
						for (let i = 0; i < arr.length; i++) {
							header += arr[i].toString(16); // building a string of hexa decimal values
						}
						switch (header) {
							case '89504e47':
								isValid = true;
								break;
							case 'ffd8ffe0':
							case 'ffd8ffe1':
							case 'ffd8ffe2':
							case 'ffd8ffe3':
							case 'ffd8ffe8':
								isValid = true;
								break;
							default:
								isValid = false;
								break;
						}
						if (isValid) observer.next(null);
						else observer.next({ invalidFileType: true });
						observer.complete();
					});
					fileReader.readAsArrayBuffer(file);
				}
			);
			return frObs;
		};
	}

	onSubmitPost() {
		if (this.postForm.valid) {
			this.isLoading = true;
			if (this.isEditMode) {
				this.postsService.updatePost(
					this.postForm.value.id!,
					this.postForm.value.title!,
					this.postForm.value.content!,
					this.postForm.value.image!
				);
			} else {
				this.postsService.createPost(
					this.postForm.value.title!,
					this.postForm.value.content!,
					this.postForm.value.image! as File
				);
			}
			this.postForm.reset();
		}
	}
	// llOqvWR4HesCKm5K
}
