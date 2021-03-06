import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LightUserSocial, Message, UserPost } from 'app/shared/_models/data';
import { AlertService } from 'app/shared/_services/alert.service';
import { UserService } from 'app/user/user.service';
import { SocialService } from 'app/shared/_services/social.service';


@Component({
  selector: 'app-publish',
  templateUrl: './publish.component.html',
  styleUrls: ['./publish.component.scss']
})
export class PublishComponent implements OnInit {
  @Input() message: Message;
  @Input() commentRequired: boolean = false;
  @Input() showText: boolean = true;
  @Input() showAttach: boolean = false;
  @Input() showLiked: boolean = false;
  @Input() customFunction: Function;
  @Input() restricted: Boolean = false;

  private accounts: LightUserSocial[] = this.userService.getLightUserSocial();
  private comment: String;
  private media: String;
  private loading = false;
  constructor(private alertService: AlertService, private userService: UserService, private socialService: SocialService) { }

  ngOnInit() {
    if (this.restricted) {
      this.accounts = this.accounts.filter(a => a.type.id === this.message.socialType.id);
    }
  }


  // User clicks on the post button
  onSave(f: NgForm) {
    this.loading = true;
    if (this.checkForm(f)) {
      // Get the selected accounts to post to
      const activePostAccounts = this.accounts.filter(a => a.active);
      const post: UserPost = {
        text: this.comment,
        media: {
          text: '',
          url: this.media, // link to the media
          src: '' // url for loading resource
        }
      }
      this.customFunction(activePostAccounts, this.message, post)
        .then(data => {
          f.reset();
          this.loading = false;
        })
        .catch(err => {
          if (err) {
            console.log('(publish-onSave) err:' + JSON.stringify(err));
            this.alertService.error('Error: ' + err);
          }
          this.loading = false;
        });
    } else {
      this.loading = false;
    }
  }

  private checkForm(f: NgForm): boolean {
    const formData = f.form['_value'];
    if (this.commentRequired && (!formData.comment || formData.comment.lenght < 1)) {
      this.alertService.error('Comment can not be empty');
      return false;
    } else if (this.accounts.length === 0) {
      this.alertService.error('No account selected');
      return false;
    } else {
      return true;
    }
  }

  private hasLiked(a: LightUserSocial) {
    return this.message.liked.indexOf(a.social_id) !== -1;
  }

  removeMedia() {
    this.media = null;
  }

}
