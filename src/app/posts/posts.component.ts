import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from './post.model';
import { PostsService } from './posts.service';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-posts',
	templateUrl: './posts.component.html',
	styleUrls: ['./posts.component.scss'],
})
export class PostsComponent implements OnInit, OnDestroy {
	posts: Post[] = [];
	subscriptions: Subscription[] = [];
	constructor(private postsService: PostsService) {}

	ngOnInit(): void {
		const postSubject: Subscription = this.postsService.postsObs.subscribe({
			next: (response) => (this.posts = response),
		});
		this.subscriptions.push(postSubject);
	}

	ngOnDestroy(): void {
		this.subscriptions.forEach((sub) => sub.unsubscribe());
	}
}
