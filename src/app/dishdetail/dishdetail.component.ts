import {Input, ViewChild, OnInit, Inject, Component} from '@angular/core';
import { Dish } from '../shared/dish';

import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { DishService } from '../services/dish.service';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Comment } from '../shared/comment';

import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})



export class DishdetailComponent implements OnInit {

  dishErrMess: string;

  formErrors = {
    'author': '',
    'comment': ''
  };

  validationMessages = {
    'author': {
      'required':      'Name is required.',
      'minlength':     'Name must be at least 2 characters long.',
      'maxlength':     'Name cannot be more than 25 characters long.'
    },
    'comment': {
      'required':      'Comment is required.',
      'minlength':     'Comment must be at least 2 characters long.',
      'maxlength':     'Comment cannot be more than 50 characters long.'
    },
  };

  commentForm:FormGroup;
  comment: Comment;

  dish: Dish;

  d: Date;
  n: string;

  dishIds: string[];
  prev: string;
  next: string;

  @ViewChild('fform') commentFormDirective;

  constructor(private dishService: DishService,
    @Inject('BaseURL') public BaseURL,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    ){}

  ngOnInit() {
    this.yourCommentForm()
    this.dishService.getDishIds()
      .subscribe((dishIds) => {this.dishIds = dishIds,
        errmess => this.dishErrMess = <any> errmess });
    this.route.params
      .pipe(switchMap((params: Params) => this.dishService.getDish(params['id'])))
      .subscribe(dish => { this.dish = dish; this.setPrevNext(dish.id);console.log(this.dish); });
  }
  
  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  goBack(): void {
    this.location.back();
  }

  yourCommentForm(){
    this.commentForm=this.fb.group({
      author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      rating:'5',
      comment: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)] ],
      date:''
      });

    this.commentForm.valueChanges
    .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now
  }



  onSubmit() {
    var d = new Date();
    var n = d.toISOString();

    this.commentForm.value.date = n;

    this.comment = this.commentForm.value;

    console.log(this.comment);
   
    this.dish.comments.push(this.comment)

    this.commentForm.reset({
      author:'',
      comment:'',
      rating:5,
      date: ''
    });

    this.commentFormDirective.resetForm();
  }

  onValueChanged(data?: any) {
    if (!this.commentForm) { return; }
    const form = this.commentForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }
}
