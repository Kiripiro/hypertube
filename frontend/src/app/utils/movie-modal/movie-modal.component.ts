import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommentsService } from 'src/app/services/comments.service';
import { Comment } from 'src/app/models/models';

@Component({
  selector: 'app-film-modal',
  templateUrl: './movie-modal.component.html',
  styleUrls: ['./movie-modal.component.scss', '../../app.component.scss'],
})
export class MovieModalComponent {
  showComments = false;
  commentForm: FormGroup;
  comments: Comment[] = [];
  replying: boolean = false;
  selectedComment: Comment | null = null;

  constructor(
    public dialogRef: MatDialogRef<MovieModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private commentsService: CommentsService
  ) {
    this.commentsService.getComments(this.data.imdb_id).subscribe({
      next: (response: any) => {
        if (response && response.comments && Array.isArray(response.comments)) {
          this.comments = response.comments;
        } else {
          console.error('Invalid response format:', response);
        }
      }, error: (error) => {
        console.log(error);
      }
    });
    this.commentForm = this.formBuilder.group({
      comment: ['', Validators.required]
    });
  }

  handleReplyToNestedComment(selectedComment: Comment) {
    console.log('Replying to nested comment:', selectedComment);
    this.selectedComment = selectedComment;
    this.replying = true;
  }

  close(): void {
    this.dialogRef.close();
  }

  showCommentsToggle() {
    this.showComments = !this.showComments;
  }

  replyToComment(comment: Comment | null = null) {
    this.replying = !this.replying;
    if (this.replying) {
      this.selectedComment = comment;
      console.log('Replying to comment:', comment);

    }
    // You can use the 'comment' parameter to determine if it's a reply or a new comment
  }

  onSubmit() {
    if (this.commentForm.invalid) {
      return;
    }
    const comment = this.commentForm.value.comment;
    if (this.selectedComment) {
      // Reply to comment
      console.log('Replying to comment:', this.selectedComment);
      this.commentsService.addComment(this.data.imdb_id, comment, this.selectedComment.id).subscribe({
        next: (response) => {
          console.log(response);
        }, error: (error) => {
          console.log(error);
        }
      });
    } else {
      this.commentsService.addComment(this.data.imdb_id, comment, undefined).subscribe({
        next: (response) => {
          console.log(response);
        }, error: (error) => {
          console.log(error);
        }
      });
    }
    this.commentForm.reset();
  }
}