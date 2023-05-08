import { Component, OnInit, inject } from '@angular/core';
import { Post } from './post.model';
import { PostsService } from './posts.service';
import { Observable, map } from 'rxjs';

@Component({
	selector: 'app-posts',
	templateUrl: './posts.component.html',
	styleUrls: ['./posts.component.scss'],
})
export class PostsComponent implements OnInit {
	postsObs!: Observable<Post[]>;
	private postsService = inject(PostsService);

	ngOnInit(): void {
		this.postsService.fetchPosts();
		this.postsObs = this.postsService.postsObs.pipe(
			map((response) => response)
		);
	}

	onDeletePost(postId: string) {
		this.postsService.deletePost(postId);
	}
}
