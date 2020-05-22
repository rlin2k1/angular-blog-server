import { Injectable } from '@angular/core';
import { Post } from './post';
@Injectable({
  providedIn: 'root'
})
export class BlogService {

  private blogUrl = 'api';  // URL to web api

  httpGetOptions = {
    method: 'GET',
    credentials: 'include'
  };

  draft: Post // Saving a past post
  username: string;

  constructor() {
    this.username = this.getUsername();
  }

  jsonToPostArray(json) {
    let result: Post[] = [];

    for(var i in json)
      result.push(new Post(i));

    return result;
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
        let pt = JSON.parse(JSON.stringify(post));
        pt.created = new Date(pt.created);
        console.log(pt.created);
        posts.push(pt);
      })
      return posts;
    })
    .catch();
  }

  getPost(username: string, postid: number): Promise<Post> {
    const url = `${this.blogUrl}/${username}/${postid}`;

    return fetch(url, {
      method: 'GET',
      credentials: 'include'
    })
    .then((response) => response.json())
    .then(response => {     
        let newPost = new Post(response);
        return newPost;
      })
    .catch();
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
        // success
        return;
      } else {
        alert('Status: ' + response.status.toString() + ', Error creating post at server!');
        // this.router.navigate(['/']);
        return;
      }
    })
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
        // success
        return;
      } else {
        alert('Status: ' + response.status.toString() + ', Error updating post at server!');
        // this.router.navigate(['/' , 'edit', post.postid]);
        return;
      }
    })
  }

  deletePost(username: string, postid: number): Promise<void> {
    const url = `${this.blogUrl}/${username}/${postid}`;
    
    return fetch(url, {
      method: 'DELETE',
      credentials: 'include',
    })
    .then(response => {
      if(response.status === 204) {
        // Success
        return;
      } else {
        alert('Status: ' + response.status.toString() + ', Error deleting post at server!');
        // DONE: ROUTE TO '/' here
        // this.router.navigate(['/']);
        return;
      }
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
}

// Helper function to extract username from JWT
function parseJWT(token)
{
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
}
