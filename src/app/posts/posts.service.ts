import { Injectable, inject } from '@angular/core';
import { Post } from './post.model';
import { Observable, map } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

const POSTS_API_URL = `http://localhost:3000/api/posts`;

@Injectable({
	providedIn: 'root',
})
export class PostsService {
	private posts: Post[] = [];

	private router = inject(Router);
	private http = inject(HttpClient);

	createPost(title: string, content: string, image: File) {
		const payload = new FormData();
		payload.append('title', title);
		payload.append('content', content);
		payload.append('image', image, title);

		this.http
			.post<{ message: string; post: Post }>(`${POSTS_API_URL}`, payload)
			.subscribe({
				next: (response) => {
					this.posts.push(response.post);
					this.router.navigate(['/']);
				},
			});
	}

	fetchPosts(
		page: number,
		pageSize: number
	): Observable<{ posts: Post[]; totalPosts: number }> {
		let queryParams = new HttpParams();
		queryParams = queryParams.append('page', page);
		queryParams = queryParams.append('pageSize', pageSize);
		return this.http
			.get<{
				message: string;
				data: {
					_id: string;
					title: string;
					content: string;
					imagePath: string;
				}[];
				totalPosts: number;
			}>(`${POSTS_API_URL}`, { params: queryParams })
			.pipe(
				map((response) => {
					const modifiedPosts: Post[] = [];
					response.data.map((post) =>
						modifiedPosts.push({
							id: post._id,
							title: post.title,
							content: post.content,
							imagePath: post.imagePath,
						})
					);
					return {
						posts: modifiedPosts,
						totalPosts: response.totalPosts,
					};
				})
			);
	}

	fetchPost(postId: string): Observable<Post> {
		return this.http
			.get<{ message: string; data: Post }>(`${POSTS_API_URL}/${postId}`)
			.pipe(map((response) => response.data));
	}

	updatePost(
		postId: string,
		title: string,
		content: string,
		image: File | string
	) {
		let payload: Post | FormData;
		if (typeof image === 'object') {
			payload = new FormData();
			payload.append('id', postId);
			payload.append('title', title);
			payload.append('content', content);
			payload.append('image', image, title);
		} else {
			payload = {
				id: postId,
				title: title,
				content: content,
				imagePath: image as string,
			} as Post;
		}
		this.http
			.put<{ message: string; data: Post }>(
				`${POSTS_API_URL}/${postId}`,
				payload
			)
			.subscribe({
				next: (response) => {
					const indexToUpdate = this.posts.findIndex(
						(p) => p.id === response.data.id
					);
					if (indexToUpdate) {
						this.posts[indexToUpdate] = response.data;
					}
					this.router.navigate(['/']);
				},
			});
	}

	deletePost(postId: string): Observable<{ message: string; data: string }> {
		return this.http.delete<{ message: string; data: string }>(
			`${POSTS_API_URL}/${postId}`
		);
	}
}
