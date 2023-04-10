import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../model/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private url:string = 'http://localhost:8080/user';

  constructor(private http:HttpClient) { }

  findAll():Observable<User[]> {
    return this.http.get<User[]>(this.url);
  }

  save(user:User):Observable<User> {
    return this.http.post<User>(this.url, user);
  }

  update(user:User):Observable<User> {
    return this.http.put<User>(this.url, user);
  }
  
  remove(idUser:number):Observable<void> {
    return this.http.delete<void>(`${this.url}/${idUser}`);
  }
}
