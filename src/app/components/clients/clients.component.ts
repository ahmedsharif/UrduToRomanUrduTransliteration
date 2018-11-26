import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { AngularFireDatabase, AngularFireList} from 'angularfire2/database';
import { Client } from '../../models/Client';
import { News } from '../../models/news';
import { Observable } from 'rxjs';



@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {
  clients: Client[];
  ListNews: News[];
  totalOwed: number;
  myNews: Observable<any[]>;

  constructor(private clientService: ClientService, db: AngularFireDatabase) {
    this.myNews = db.list('romanurdu-912c3').valueChanges();
    console.log("this.myNews final", this.myNews.subscribe())
   }

  ngOnInit() {
    this.clientService.getClients().subscribe(clients => {
      this.clients = clients;
      this.getTotalOwed();
    });

    // this.clientService.getNews().subscribe(news => {
    //   console.log(news);
    // })
    this.clientService.getNews().subscribe();
    console.log("this.clientService.getNews();")
  }

  getTotalOwed() {
    this.totalOwed = this.clients.reduce((total, client) => {
      return total + parseFloat(client.balance.toString());
    }, 0);
  }

}
