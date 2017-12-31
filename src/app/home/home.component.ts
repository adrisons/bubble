import { Component, OnInit } from '@angular/core';
import { SocialService } from 'app/shared/_services/social.service';

import { message1, message2, message3, message4 } from 'app/shared/_models/mocks';
import { DataSessionService } from 'app/shared/_services/data-session.service';
import { Message, UserSocial, LightUserSocial, UserPost } from 'app/shared/_models/data';
import { UserService } from 'app/user/user.service';
import { AlertService } from 'app/shared/_services/alert.service';

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

  private refreshLoading = false;
  private loadMoreLoading = false;
  private timeline: Message[] = [];
  constructor(private socialService: SocialService, private dataService: DataSessionService, private userService: UserService,
    private alertService: AlertService) { }

  ngOnInit() {
    this.timeline = this.dataService.getTimeline();
    if (this.timeline.length === 0) {
      this.getTimeline();
    }

  }

  getTimeline() {
    this.refreshLoading = true;
    this.socialService.getTimeline().then((t: Message[]) => {
      this.timeline = t;
      console.log('home timeline:' + this.timeline);
      this.dataService.save(this.timeline);
      this.refreshLoading = false;
    })
      .catch(err => {
        this.alertService.error(err);
        this.refreshLoading = false;
      });
  }
  getNextTimeline() {
    this.loadMoreLoading = true;
    this.socialService.getNextTimeline().then((t: Message[]) => {
      console.log('next timeline:' + t);
      this.timeline = this.timeline.concat(t);
      this.dataService.save(this.timeline);
      this.loadMoreLoading = false;
    })
      .catch(err => {
        this.alertService.error(err);
        this.loadMoreLoading = false;
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

  share(accounts: LightUserSocial[], m: Message, post: UserPost) {

    return this.socialService.share(accounts, m, post, () => {
      this.shareToggle(m);
    });
  }

  reply(accounts: LightUserSocial[], m: Message, post: UserPost) {

    return this.socialService.reply(accounts, m, post, () => { this.commentToggle(m); });
  }

  post(accounts: LightUserSocial[], m: Message, post: UserPost) {
    return this.socialService.post(accounts, m, post, () => { });
  }

  like(accounts: LightUserSocial[], m: Message, post: UserPost) {

    if (m.liked) {
      return this.socialService.unlike(accounts, m, post, () =>
        this.likeToggle(m));
    } else {
      return this.socialService.like(accounts, m, post, () =>
        this.likeToggle(m));
    }
  }

}
