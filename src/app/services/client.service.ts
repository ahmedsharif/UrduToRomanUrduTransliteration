import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from "angularfire2/firestore";
import { AngularFireDatabase, AngularFireList} from 'angularfire2/database';
import { Observable } from "rxjs/Observable";

import { Client } from "../models/Client";
import {News} from "../models/news";

@Injectable()
export class ClientService {
  clientsCollection: AngularFirestoreCollection<Client>;
  myData: AngularFireList<News[]>;
  news: Observable<any>;
  

  clientDoc: AngularFirestoreDocument<Client>;
  clients: Observable<Client[]>;
  client: Observable<Client>;

  constructor(private afs: AngularFirestore, db: AngularFireDatabase) {
    this.clientsCollection = this.afs.collection("client", ref =>
      ref.orderBy("lastName", "asc")
    );
    this.myData = db.list('romanurdu-912c3');
    // this.news = this.myData.snapshotChanges().map(changes =>  
    //   changes.map(c => ({ id: c.payload, 
    //     NewsId:  c.payload.val})));
    // console.log("this.nes", this.myData.valueChanges());
    // console.log("this.news", this.news);
  }

  getNews() {
    this.news = this.myData.snapshotChanges().map(changes => {
      return changes.map(c => 
        ({ id: c.payload.val, 
        NewsId:  c.payload.val}))
    });
    return this.myData.valueChanges()
    console.log("this.nes", this.myData.valueChanges());
    console.log("this.news", this.news);
  }

  getClients(): Observable<Client[]> {
    // Get clients with the id
    this.clients = this.clientsCollection.snapshotChanges().map(changes => {
      return changes.map(action => {
        const data = action.payload.doc.data() as Client;
        data.id = action.payload.doc.id;
        return data;
      });
    });
    console.log('this.clients', this.clients);

    return this.clients;
  }

  getUrduNewsFromFirebase() {
  }

  newClient(client: Client) {
    this.clientsCollection.add(client);
  }

  getClient(id: string): Observable<Client> {
    this.clientDoc = this.afs.doc<Client>(`client/${id}`);
    this.client = this.clientDoc.snapshotChanges().map(action => {
      if (action.payload.exists === false) {
        return null;
      } else {
        const data = action.payload.data() as Client;
        data.id = action.payload.id;
        return data;
      }
    });
    return this.client;
  }

  updateClient(client: Client) {
    this.clientDoc = this.afs.doc(`client/${client.id}`);
    this.clientDoc.update(client);
  }  

  deleteClient(client: Client) {
    this.clientDoc = this.afs.doc(`client/${client.id}`);
    this.clientDoc.delete();
  }  
}
