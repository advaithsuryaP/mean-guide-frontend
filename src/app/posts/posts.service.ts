import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class PostsService {
	private posts: Post[] = [];

	private postsSubject = new Subject<Post[]>();
	postsObs = this.postsSubject.asObservable();

	createPost(title: string, content: string) {
		const newPost: Post = {
			postTitle: title,
			postContent: content,
		};
		this.posts.push(newPost);
		this.postsSubject.next([...this.posts]);
	}
}
