import { Component, OnInit } from '@angular/core';
import { Post } from '../post';
import { BlogService } from '../blog.service'
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  post: Post = { postid: 1, title: "MyTitle", body: "MyBody", created: new Date(0) ,modified: new Date(0)}; //TODO: Routing

  constructor(private blogService: BlogService, private route: ActivatedRoute, public router: Router) {
  }

  ngOnInit(): void {
    // Need to make sure there is a current draft. Current draft is for saving the changes.
    this.route.params.subscribe(params => {
      this.post = this.blogService.getCurrentDraft();
    });
  }

  delete(): void {
    alert("Delete button pressed!");
  }

  save(): void {
    alert("Save button pressed!");
  }

  preview(): void {
    alert("Preview button pressed!");
  }

}
