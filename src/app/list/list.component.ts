import { Component, OnInit } from '@angular/core';
import { Post } from '../post';
import { BlogService } from '../blog.service'

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  posts: Post[];
  username: string;

  constructor(private blogService: BlogService) {
  }

  ngOnInit(): void {
    this.username = this.blogService.getUsername();
    this.blogService.fetchPosts(this.username)
    .then (posts => {
      this.posts = posts;
    })
  }

}
