import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AlertService } from 'app/shared/_services/alert.service';
import { User } from 'app/shared/_models/data';
import { UserService } from 'app/user/user.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  private comment: String;
  constructor(private alertService: AlertService, private userService: UserService) { }

  ngOnInit() {
  }

  // User clicks on the register button
  onPost(f: NgForm) {
    this.checkForm(f);
  }

  private checkForm(f: NgForm) {
    const formData = f.form['_value'];
    if (!formData.comment || formData.comment.lenght < 1) {
      this.alertService.error('Comment can not be empty');
    }
  }
}
