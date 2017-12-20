import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AlertService } from 'app/shared/_services/alert.service';
import { User, LightUserSocial } from 'app/shared/_models/data';
import { UserService } from 'app/user/user.service';
import { SocialService } from 'app/shared/_services/social.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  private comment: String;
  private postAccounts: LightUserSocial[] = this.userService.getLightUserSocial();
  constructor(private alertService: AlertService, private userService: UserService, private socialService: SocialService) {
  }

  ngOnInit() {

  }

  // User clicks on the register button
  onPost(f: NgForm) {
    if (this.checkForm(f)) {
      const activePostAccounts = this.postAccounts.filter(a => a.active);
      this.socialService.post(this.comment, activePostAccounts).then(data => {
        this.alertService.success('Correctly posted!');
        f.reset();
      });
    }
  }

  private checkForm(f: NgForm): boolean {
    const formData = f.form['_value'];
    if (!formData.comment || formData.comment.lenght < 1) {
      this.alertService.error('Comment can not be empty');
      return false;
    } else {
      return true;
    }
  }

}
