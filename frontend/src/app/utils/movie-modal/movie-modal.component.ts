import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommentsService } from 'src/app/services/comments.service';
import { Comment } from 'src/app/models/models';
import { LocalStorageService } from 'src/app/services/local-storage.service';

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
  editing: boolean = false;
  selectedComment: Comment | null = null;
  id: number = this.localStorageService.getItem('id') || null;
  ytsId: number | null = null;

  constructor(
    public dialogRef: MatDialogRef<MovieModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private commentsService: CommentsService,
    private localStorageService: LocalStorageService
  ) {
    this.ytsId = data.yts_id;
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
    this.replying = true;
    this.replyToComment(selectedComment);
  }
  handleEditNestedComment(selectedComment: Comment) {
    this.editComment(selectedComment);
  }

  close(): void {
    this.dialogRef.close();
  }

  showCommentsToggle() {
    this.showComments = !this.showComments;
    if (!this.showComments) {
      this.replying = false;
      this.selectedComment = null;
    }
  }

  replyToComment(comment: Comment | null = null) {
    console.log('Replying to comment:', comment);
    if (comment) {
      this.selectedComment = comment;
      this.replying = true;
    }
  }

  cancelReplyOrEdit() {
    if (this.replying) {
      this.replying = false;
      this.selectedComment = null;
    }
    if (this.editing) {
      this.editing = false;
      this.selectedComment = null;
    }
    this.commentForm.reset();
  }

  editComment(comment: Comment) {
    this.selectedComment = comment;
    this.editing = true;
    this.commentForm.setValue({ comment: comment.text });
  }

  onSubmit() {
    if (this.commentForm.invalid) {
      return;
    }
    const comment = this.commentForm.value.comment;
    if (this.selectedComment && this.replying && !this.editing) {
      this.commentsService.addComment(this.data.imdb_id, comment, this.selectedComment.id).subscribe({
        next: (response: any) => {
          this.comments.push(response.comment);
          this.replying = false;
          this.selectedComment = null;
        }, error: (error) => {
          console.log(error);
        }
      });
    } else if (this.selectedComment && this.editing) {
      const updatedComment: Comment = { ...this.selectedComment as Comment, text: comment };
      this.commentsService.updateComment(updatedComment).subscribe({
        next: (response: any) => {
          console.log(response);
          const updatedComment: Comment = { ...response.comment, updatedAt: new Date() };
          this.comments = this.comments.map(comment => comment.id === response.comment.id ? updatedComment : comment);
          console.log(this.comments);
          this.editing = false;
          this.selectedComment = null;
        }, error: (error) => {
          console.log(error);
        }
      });
    } else {
      this.commentsService.addComment(this.data.imdb_id, comment, undefined).subscribe({
        next: (response: any) => {
          this.comments.push(response.comment);
        }, error: (error) => {
          console.log(error);
        }
      });
    }
    this.commentForm.reset();
  }
}
