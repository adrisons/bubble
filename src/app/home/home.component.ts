import { Component, OnInit } from '@angular/core';
import { SocialService } from 'app/shared/_services/social.service';

import { message1, message2, message3, message4 } from 'app/shared/_models/mocks';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  private comment: String;
  private filters = {
    social: {
      twitter: false,
      facebook: false
    }
  };

  // private timeline = [message1, message2, message3, message4];
private timeline;
  constructor(private socialService: SocialService) { }

  ngOnInit() {
  }

  getTimeline() {
    this.socialService.getTimeline().then(t => {
      this.timeline = t;
      console.log('home timeline:' + this.timeline);
    });
  }


  likeToggle(m) {
    m.flags.like = !m.flags.like;
  }
  share(m) {
    m.shared = true;
  }
  commentToggle(m) {
    m.flags.comment = !m.flags.comment;
  }
  onReply(m) {

  }


}
