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