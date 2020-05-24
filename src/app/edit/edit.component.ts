import { Component, OnInit } from '@angular/core';
import { Post } from '../post';
import { BlogService } from '../blog.service'
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  post: Post;
  username: string;

  constructor(private blogService: BlogService, private route: ActivatedRoute, private location: Location, public router: Router) {
  }

  ngOnInit(): void {
    this.username = this.blogService.getUsername();
    // Need to make sure there is a current draft. Current draft is for saving the changes.
    this.route.params.subscribe(params => {
      this.getPost();
    });
  }

  getPost(): void {
    const postid = +this.route.snapshot.paramMap.get('id');

    this.post = this.blogService.getCurrentDraft();

    if (this.post === undefined || this.post.postid !== postid) {
      this.blogService.getPost(this.username, postid)
      .then (post => {
        if(post !== undefined) { // No post available
          this.post = post;
        } else {
          let newPost = this.blogService.getCurrentDraft();
          if (newPost.postid === postid) {
            this.post = newPost;
          } else {
            this.router.navigate(['/']);
          }
        }
      })
      .catch(error => this.router.navigate(['/']));
    }

    // if (draft === undefined) {
    //   this.blogService.getPost(username, postid)
    //   .then (post => {
    //     this.post = post;
    //   });
    // } else {
    //   this.post = draft;
    // }
  }

  delete(): void {
    this.blogService.deletePost(this.username, this.post.postid);
    this.router.navigate(['/']);
  }

  save(): void {
    // Depending on New Post or Not, we will PUT/POST
    if (this.post.created === undefined) {
      this.blogService.newPost(this.username, this.post);
    } else {
      this.blogService.updatePost(this.username, this.post);
    }
    this.getPost(); // Get updated modified time
  }

  preview(): void {
    this.blogService.setCurrentDraft(this.post); // Save the post for Preview Display
    this.router.navigate([`/preview/${this.post.postid}`])
  }

}
