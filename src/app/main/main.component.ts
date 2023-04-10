import { Component } from '@angular/core';
import { User } from '../model/User';
import { UserService } from '../service/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../shared/dialog/confirmation-dialog/confirmation-dialog.component';
import { HttpErrorResponse } from '@angular/common/http';
import { empty } from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {

    user = new User();

    isAnUserSelected:boolean = false;

    tableVisible:boolean = true;

    users:User[] = [];

    constructor(
      private service:UserService,
      private dialog: MatDialog,
      public snackBar: MatSnackBar
    ){}

    findAll():void {
      this.service.findAll()
      .subscribe(users => this.users = users);
    }

    save():void {
      this.service.save(this.user)
      .subscribe(user => { 
        this.users.push(user);
      });

      this.snackBar.open('User saved with success!', 'Fechar', { duration: 5000 });
      //alert('User saved with success!');
      
      this.new();
    }

    update():void {
      this.service.update(this.user)
      .subscribe(user => { 
        
        let indexUpdatedUser = this.users.findIndex(obj => {
          return obj.id == user.id;
        });

        this.users[indexUpdatedUser] = user;
      });

      alert('User updated with success!');
      
      this.new();
    }

    confirmRemove():void {
      const config = new MatDialogConfig();
      config.data = { message: 'Do you really want to remove this user?' };
      this.dialog.open(ConfirmationDialogComponent, config)
        .afterClosed()
        .subscribe(confirm => {
          if (confirm) {
            this.remove();
          }
      });
    }

    remove():void {

      this.service.remove(this.user.id)
      .toPromise()
      .then(() => {
        let indexRemovedUser = this.users.findIndex(obj => {
          return obj.id == this.user.id;
        });

        this.users.splice(indexRemovedUser, 1);

        this.snackBar.open('User removed with success!', 'Fechar', { duration: 5000 });

      }).catch((error: HttpErrorResponse) => {
        console.error(error);
        this.snackBar.open('Falha interna ao remover!', 'Fechar', { duration: 5000 });
      }).finally(() => this.new());
    }

    selectUserFromTable(userSelected:User):void {
      this.user = userSelected;

      this.isAnUserSelected = true;
      this.tableVisible = false;
    }

    cancel():void {
      this.new();
    }

    new():void {
      //clean inputs
      this.user = new User();

      this.isAnUserSelected = false;
      this.tableVisible = true;
    }

    ngOnInit(){
      this.findAll();
    }
}
