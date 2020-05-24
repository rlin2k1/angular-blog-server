import { Injectable } from '@angular/core';
import { Post } from './post';
@Injectable({
  providedIn: 'root'
})
export class BlogService {

  private blogUrl = 'api';  // URL to web api

  draft: Post // Saving a past post

  constructor() {}

  genPostid(posts: Post[]): number {
    return posts.length > 0 ? Math.max(...posts.map(post => post.postid)) + 1 : 1;
  }

  callback = null;
  subscribe(callback) {
    this.callback = callback;
  }

  fetchPosts(username: string): Promise<Post[]> {
    const url = `${this.blogUrl}/${username}`;

    return fetch(url, {
      method: 'GET',
      credentials: 'include'
    })
    .then((response) => response.json())
    .then(response => {
      let posts: Post[] = [];

      response.forEach(post => {
        let parsedPost = JSON.parse(JSON.stringify(post));
        posts.push(parsedPost);
      })
      return posts;
    })
    .catch(error => {
      this.handleError<Post[]>(error, 'fetchPosts');
      return null;
    });
  }

  getPost(username: string, postid: number): Promise<Post> {
    const url = `${this.blogUrl}/${username}/${postid}`;

    return fetch(url, {
      method: 'GET',
      credentials: 'include'
    })
    .then(response => {
      console.log("REACHED")
      if(response.status === 404) {
        console.log("REACHEDdd")
        throw new Error ("Undefined")
      }
      console.log("REACHfdsfsdfED")
      return response.json();
    })
    .then(response => {   
        let post = new Post();
        post.postid = response.postid;
        post.created = response.created;
        post.modified = response.modified;
        post.title = response.title;
        post.body = response.body;
        return post;
      })
    .catch(error => {
      //this.handleError<Post>(error, 'getPost');
      return undefined;
    });
  }

  newPost(username: string, post: Post): Promise<void> {
    // Need to calculate updated postid using post.postid
    const url = `${this.blogUrl}/${username}/${post.postid}`;

    return fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({title: post.title, body: post.body})
    })
    .then((response) => {
      if(response.status === 201) {
        // success - let the list component know
        if (this.callback){
          let username = this.getUsername();
          this.fetchPosts(username)
          .then (posts => {
            this.callback(posts);
          });
        }
        return;
      } else {
        alert('Status: ' + response.status.toString() + ', Error creating post at server!');
        // this.router.navigate(['/']);
        return;
      }
    })
    .catch(error => {
      this.handleError<Post>(error, 'newPost');
      return;
    });
  }

  updatePost(username: string, post: Post): Promise<void> {
    const url = `${this.blogUrl}/${username}/${post.postid}`;

    return fetch(url, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({title: post.title, body: post.body})
    })
    .then((response) => {
      if(response.status === 200) {
        // success - let the list component know
        if (this.callback){
          let username = this.getUsername();
          this.fetchPosts(username)
          .then (posts => {
            this.callback(posts);
          });
        }
        return;
      } else {
        alert('Status: ' + response.status.toString() + ', Error updating post at server!');
        // this.router.navigate(['/' , 'edit', post.postid]);
        return;
      }
    })
    .catch(error => {
      this.handleError<Post>(error, 'newPost');
      return;
    });
  }

  deletePost(username: string, postid: number): Promise<void> {
    const url = `${this.blogUrl}/${username}/${postid}`;
    
    return fetch(url, {
      method: 'DELETE',
      credentials: 'include',
    })
    .then(response => {
      if(response.status === 204) {
        // success - let the list component know
        if (this.callback){
          let username = this.getUsername();
          this.fetchPosts(username)
          .then (posts => {
            this.callback(posts);
          });
        }
        return;
      } else {
        alert('Status: ' + response.status.toString() + ', Error deleting post at server!');
        // DONE: ROUTE TO '/' here
        // this.router.navigate(['/']);
        return;
      }
    })
    .catch(error => {
      this.handleError<Post>(error, 'newPost');
      return;
    });
  }

  setCurrentDraft(post: Post): void {
    this.draft = post;
    return;
  }

  getCurrentDraft(): Post {
    return this.draft;
  }

  getUsername(): string {
    if(!document.cookie) return null;
    let token = parseJWT(document.cookie);
    let username = token.usr;
    if(username) {
      return username;
    } else {
      return null;
    }
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(error: any, operation = 'operation') {
      console.error(error); // log to console instead

      console.log(`${operation} failed: ${error.message}`);
  }
}

// Helper function to extract username from JWT
function parseJWT(token)
{
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
}
