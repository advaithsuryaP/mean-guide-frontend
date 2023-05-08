import { Injectable, inject } from '@angular/core';
import { Post } from './post.model';
import { Observable, Subject, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

const POSTS_API_URL = `http://localhost:3000/api/posts`;

@Injectable({
	providedIn: 'root',
})
export class PostsService {
	private posts: Post[] = [];

	private postsSubject = new Subject<Post[]>();
	postsObs = this.postsSubject.asObservable();

	private router = inject(Router);
	private http = inject(HttpClient);

	createPost(title: string, content: string) {
		const newPost: Post = {
			id: '',
			title: title,
			content: content,
		};

		this.http
			.post<{ message: string; data: Post }>(`${POSTS_API_URL}`, newPost)
			.subscribe({
				next: (response) => {
					const newPost: Post = response.data;
					this.posts.push(newPost);
					this.postsSubject.next([...this.posts]);
					this.router.navigate(['/']);
				},
			});
	}

	fetchPosts(): void {
		this.http
			.get<{
				message: string;
				data: { _id: string; title: string; content: string }[];
			}>(`${POSTS_API_URL}`)
			.pipe(
				map((response) => {
					const modifiedPosts: Post[] = [];
					response.data.map((post) =>
						modifiedPosts.push({
							id: post._id,
							title: post.title,
							content: post.content,
						})
					);
					return modifiedPosts;
				})
			)
			.subscribe({
				next: (modifiedPosts) => {
					this.posts = modifiedPosts;
					this.postsSubject.next([...this.posts]);
				},
			});
	}

	fetchPost(postId: string): Observable<Post> {
		return this.http
			.get<{ message: string; data: Post }>(`${POSTS_API_URL}/${postId}`)
			.pipe(map((response) => response.data));
	}

	updatePost(postId: string, title: string, content: string) {
		const newPost: Post = {
			id: postId,
			title: title,
			content: content,
		};
		this.http
			.put<{ message: string; data: Post }>(
				`${POSTS_API_URL}/${postId}`,
				newPost
			)
			.subscribe({
				next: (response) => {
					const indexToUpdate = this.posts.findIndex(
						(p) => p.id === response.data.id
					);
					if (indexToUpdate) {
						this.posts[indexToUpdate] = response.data;
						this.postsSubject.next([...this.posts]);
					}
					this.router.navigate(['/']);
				},
			});
	}

	deletePost(postId: string): void {
		this.http
			.delete<{ message: string; data: string }>(
				`${POSTS_API_URL}/${postId}`
			)
			.subscribe({
				next: (response) => {
					const indexToBeDeleted = this.posts.findIndex(
						(post) => post.id === response.data
					);
					this.posts.splice(indexToBeDeleted, 1);
					this.postsSubject.next([...this.posts]);
				},
			});
	}
}
