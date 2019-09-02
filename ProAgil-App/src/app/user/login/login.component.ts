import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  titulo: string;
  model: any = {};

  constructor(public router: Router) {
    this.titulo = 'Login';
  }

  ngOnInit() {
  }

  login() {
    console.log("");
  }

}
