import { Component, OnInit } from '@angular/core';
import { SocialService } from 'app/shared/_services/social.service';

import { message1, message2, message3, message4 } from 'app/shared/_models/mocks';
import { DataSessionService } from 'app/shared/_services/data-session.service';
import { Message, UserSocial, LightUserSocial } from 'app/shared/_models/data';
import { UserService } from 'app/user/user.service';

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


  private timeline: Message[] = [];
  constructor(private socialService: SocialService, private dataService: DataSessionService, private userService: UserService) { }

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


  likeToggle(m: Message) {
    m.flags.share = false;
    m.flags.comment = false;
    m.flags.like = !m.flags.like;
  }

  shareToggle(m: Message) {
    m.flags.comment = false;
    m.flags.like = false;
    m.flags.share = !m.flags.share;
  }

  commentToggle(m: Message) {
    m.flags.share = false;
    m.flags.like = false;
    m.flags.comment = !m.flags.comment;
  }

  share(accounts: LightUserSocial[], m: Message, text: String) {

    return this.socialService.share(accounts, m, text, () => {
      this.shareToggle(m);
    });
  }

  reply(accounts: LightUserSocial[], m: Message, text: String) {

    return this.socialService.reply(accounts, m, text, () => { this.commentToggle(m); });
  }

  post(accounts: LightUserSocial[], m: Message, text: String) {
    return this.socialService.post(accounts, m, text, () => {});
  }

  like(accounts: LightUserSocial[], m: Message, text: String) {

    if (m.liked) {
      return this.socialService.unlike(accounts, m, text, () =>
        this.likeToggle(m));
    } else {
      return this.socialService.like(accounts, m, text, () =>
        this.likeToggle(m));
    }
  }

}
