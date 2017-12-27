import { Component, OnInit } from '@angular/core';
import { SocialService } from 'app/shared/_services/social.service';

import { message1, message2, message3, message4 } from 'app/shared/_models/mocks';
import { DataSessionService } from 'app/shared/_services/data-session.service';
import { Message, UserSocial, LightUserSocial } from 'app/shared/_models/data';

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

  shareToggle(m) {
    m.flags.comment = false;
    m.flags.share = !m.flags.share;
  }

  commentToggle(m) {
    m.flags.share = false;
    m.flags.comment = !m.flags.comment;
  }

  share(accounts: LightUserSocial[], m: Message, text: String): Promise<{}> {
    return this.socialService.share(accounts, m, text);
  }

  reply(accounts: LightUserSocial[], m: Message, text: String): Promise<{}> {
    return this.socialService.reply(accounts, m, text);
  }

  post(accounts: LightUserSocial[], m: Message, text: String): Promise<{}> {
    return this.socialService.post(accounts, m, text);
  }


}
