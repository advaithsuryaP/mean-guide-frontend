import { Component, OnInit, inject } from '@angular/core';
import { Post } from './post.model';
import { PostsService } from './posts.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
	selector: 'app-posts',
	templateUrl: './posts.component.html',
	styleUrls: ['./posts.component.scss'],
})
export class PostsComponent implements OnInit {
	posts: Post[] = [];
	pageIndex: number = 0;
	totalPosts: number = 0;
	postsPerPage: number = 2;

	isLoading: boolean = true;
	private postsService = inject(PostsService);

	ngOnInit(): void {
		this.fetchPosts();
	}

	private fetchPosts(): void {
		this.isLoading = true;
		this.postsService
			.fetchPosts(this.pageIndex + 1, this.postsPerPage)
			.subscribe({
				next: (response) => {
					this.isLoading = false;
					this.posts = response.posts;
					this.totalPosts = response.totalPosts;
				},
			});
	}

	onPageChange(event: PageEvent) {
		this.postsPerPage = event.pageSize;
		this.pageIndex = event.pageIndex;
		this.fetchPosts();
	}

	onDeletePost(postId: string): void {
		this.postsService.deletePost(postId).subscribe({
			next: (_) => this.fetchPosts(),
		});
	}
}
