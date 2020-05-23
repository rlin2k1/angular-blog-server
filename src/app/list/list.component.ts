import { Component, OnInit } from '@angular/core';
import { Post } from '../post';
import { BlogService } from '../blog.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  posts: Post[];

  constructor(private blogService: BlogService, public router: Router) {
  }

  ngOnInit(): void {
    let username = this.blogService.getUsername();
    this.blogService.fetchPosts(username)
    .then (posts => {
      this.posts = posts;
    })
  }

  newPost(): void {
    // Creates a new empty post

    // Sets current draft
    //this.blogService.setCurrentDraft(post);
    // Opens the edit view
    //this.router.navigate([`/edit/${post.postid}`])
  }

  setCurrentDraft(post: Post): void {
    // Sets current draft
    this.blogService.setCurrentDraft(post);
    // Opens the edit view
    this.router.navigate([`/edit/${post.postid}`])
  }
}
