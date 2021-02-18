import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { BehaviorSubject } from 'rxjs'

@Injectable()
export class MessagingService {
  url: any;
  currentMessage = new BehaviorSubject(null);
  constructor(private angularFireMessaging: AngularFireMessaging) {
    this.angularFireMessaging.messaging.subscribe(
      (_messaging) => {
        _messaging.onMessage = _messaging.onMessage.bind(_messaging);
        _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
      }
    )
  }

  requestPermission() {
    this.angularFireMessaging.requestToken.subscribe(
      (token) => {
        console.log(token);
      },
      (err) => {
        console.error('Unable to get permission to notify.', err);
      }
    );
  }

  receiveMessage() {
    this.angularFireMessaging.messages.subscribe(
      (payload) => {
        console.log("new message received. ", payload);
        this.currentMessage.next(payload);
        this.showCustomNotification(payload);
      })
  }

  showCustomNotification(payload: any){
    let notify_data = payload ['notification'];
    let title = notify_data['title'];
    let options={
      body: notify_data['body'],
    
    };
    
    console.log("New message received.", notify_data)
    let notify: Notification = new Notification(title,options)
    
    notify.onclick = event=>{
      event.preventDefault();
      this.url='https://www.google.com';
      var win = window.open(this.url, '_blank');
       win.focus();
      // window.location.href='https://www.google.com';
    }
    }
}