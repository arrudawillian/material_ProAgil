import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {

  eventos: any = [];
  imgLargura = 50;
  imgMargem = 2;
  mostrarImg: boolean;
  filtroLista = '';

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getEventos();
  }

  alternarImg() {
    this.mostrarImg = !this.mostrarImg;
  }

  getEventos() {
    this.http.get('http://localhost:5000/api/values').subscribe(response => {
      this.eventos = response;
      console.log(this.eventos);
    }, error => {
      console.log(error);
    }
    );
  }

}
