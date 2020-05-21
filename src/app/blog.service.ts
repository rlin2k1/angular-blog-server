import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  private blogUrl = 'api';  // URL to web api

  draft: Post // Saving a past post

  constructor() { }

  jsonToPostArray(json) {
    let result: Post[] = [];

    for(var i in json)
      result.push(new Post(i));

    return result;
  }

  fetchPosts(username: string): Promise<Post[]> {
    const url = `${this.blogUrl}/${username}`;

    fetch(url)
    .then((res) => res.json())
    .then((json) => {
      let res = this.jsonToPostArray(json);
      return res;
    })
    .catch();
  }

  getPost(username: string, postid: number): Promise<Post> {
    const url = `${this.blogUrl}/${username}/${postid}`;

    fetch(url)
    .then((res) => res.json())
    .then((json) => {
      let res = this.jsonToPostArray(json);
      return res;
    })
    .catch();
  }

  newPost(username: string, post: Post): Promise<void> {
    // Need to calculate updated postid using post.postid
    const url = `${this.blogUrl}/${username}/${post.postid}`;

    fetch(url)
    .then((res) => res.json())
    .then((json) => {
      let res = this.jsonToPostArray(json);
      return res;
    })
    .catch();
  }

  updatePost(username: string, post: Post): Promise<void> {
    const url = `${this.blogUrl}/${username}/${post.postid}`;

    fetch(url)
    .then((res) => res.json())
    .then((json) => {
      let res = this.jsonToPostArray(json);
      return res;
    })
    .catch();
  }

  deletePost(username: string, postid: number): Promise<void> {
    const url = `${this.blogUrl}/${username}/${postid}`;
    
    fetch(url)
    .then((res) => res.json())
    .then((json) => {
      let res = this.jsonToPostArray(json);
      return res;
    })
    .catch();
  }

  setCurrentDraft(post: Post): void {
    this.draft = post;
    return;
  }

  getCurrentDraft(): Post {
    return this.draft;
  }
}

export class Post {
  postid: number;
  created: Date;
  modified: Date;
  title: string;
  body: string;

  constructor(jsonObject) {
    this.postid = jsonObject.postid;
    this.created = jsonObject.created;
    this.modified = jsonObject.modified;
    this.title = jsonObject.title;
    this.body = jsonObject.body;
  }
}