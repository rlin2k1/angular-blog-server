import { Component, OnInit } from '@angular/core';
import { BlogService } from '../blog.service'
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Parser, HtmlRenderer } from 'commonmark';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit {
  postid: number;
  markdownTitle: string;
  markdownBody: string;

  reader = new Parser();
  writer = new HtmlRenderer();

  constructor(private blogService: BlogService, private route: ActivatedRoute, public router: Router) {
  }

  ngOnInit(): void {
    // Need to make sure there is a current draft. Current draft is for saving the changes.
    this.route.params.subscribe(params => {
      this.previewPost();
    });
  }

  previewPost(): void {
    this.postid = +this.route.snapshot.paramMap.get('id');
    let draft = this.blogService.getCurrentDraft();

    if (draft !== undefined && draft.postid === this.postid) {
      this.markdownTitle = this.writer.render(this.reader.parse(draft.title));
      this.markdownBody = this.writer.render(this.reader.parse(draft.body));
      this.postid = draft.postid;
    } else {
      let username = this.blogService.getUsername();
      this.blogService.getPost(username, this.postid)
      .then (post => {
        if(post !== undefined) { // No post available
          this.markdownTitle = this.writer.render(this.reader.parse(post.title));
          this.markdownBody = this.writer.render(this.reader.parse(post.body));
        } else {
          this.router.navigate(['/']);
        }
      })
      .catch( () => this.router.navigate(['/']));
    }
  }

}
