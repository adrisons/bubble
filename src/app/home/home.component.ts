import { Component, OnInit } from '@angular/core';
import { SocialService } from 'app/shared/_services/social.service';

import { message1, message2, message3, message4 } from 'app/shared/_models/mocks';
import { DataSessionService } from 'app/shared/_services/data-session.service';
import { Message } from 'app/shared/_models/data';

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


  private timeline: Array<Message> = [];
  constructor(private socialService: SocialService, private dataService: DataSessionService) { }

  ngOnInit() {
    this.timeline = this.dataService.getTimeline();
    if (this.timeline.length === 0) {
      this.getTimeline();
    }
  }

  getTimeline() {
    this.socialService.getTimeline().then((t: Message[]) => {
      this.timeline = t;
      console.log('home timeline:' + this.timeline);
      this.dataService.save(this.timeline);
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
