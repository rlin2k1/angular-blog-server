import { Component, OnInit } from '@angular/core';
import { Post } from '../post';
import { BlogService } from '../blog.service'
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  posts: Post[];
  selectedPostId: number;

  constructor(private blogService: BlogService, private route: ActivatedRoute, public router: Router) {
  }

  ngOnInit(): void {
    this.route.params.subscribe( () => {
      this.getBlogs();
    });
    this.blogService.subscribe( posts => { this.posts = posts; }); // Subscribe whenever the blog list is changed
  }

  getBlogs(): void {
    let username = this.blogService.getUsername();
    this.blogService.fetchPosts(username)
    .then (posts => {
      this.posts = posts;
    });
  }

  newPost(): void {
    // Gets highest Postid
    let postid = this.blogService.genPostid(this.posts);
    // Creates a new empty post
    let post = new Post();
    post.postid = postid;
    post.title = '';
    post.body = '';
    post.created = undefined;
    // Sets current draft
    this.blogService.setCurrentDraft(post); // Save the post for Preview Display
    // Opens the edit view
    this.router.navigate([`/edit/${postid}`])
  }

  onSelect(post: Post): void {
    // Sets current draft
    this.selectedPostId = post.postid;
    // Opens the edit view
    this.router.navigate([`/edit/${post.postid}`])
  }
}
