import { Component, OnInit } from '@angular/core';
import { EventoService } from '../_services/evento.service';
import { Evento } from '../_models/Evento';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { defineLocale, BsLocaleService, ptBrLocale } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';

defineLocale('pt-br', ptBrLocale);

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {

  titulo = 'Eventos';
  eventosFiltrados: Evento[];
  eventos: Evento[];
  evento: Evento;
  imgLargura = 50;
  imgMargem = 2;
  modoSalvar: string;
  mostrarImg: boolean;
  registerForm: FormGroup;
  bodyDeletarEvento: any;
  file: File;
  _filtroLista: string;
  currentFileName: string;


  constructor(
    private eventoService: EventoService
    , private fb: FormBuilder
    , private localeService: BsLocaleService
    , private toastr: ToastrService
  ) {
    this.localeService.use('pt-br');
    this.modoSalvar = 'post';
  }

  get filtroLista(): string {
    return this._filtroLista;
  }
  set filtroLista(value: string) {
    this._filtroLista = value;
    this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos;
  }

  ngOnInit() {
    this.validation();
    this.getEventos();
  }

  getEventos() {
    return this.eventoService.getAllEvento().subscribe((_eventos: Evento[]) => {
      this.eventos = _eventos;
      this.eventosFiltrados = this.eventos;
      console.log('eventos', _eventos);
    }, error => {
      this.toastr.error(`Erro ao tentar carregar eventos: ${error}`)
      console.log(error);
    }
    );
  }

  filtrarEventos(filtrarPor: string): Evento[] {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      evento => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }

  alternarImg() {
    this.mostrarImg = !this.mostrarImg;
  }

  validation() {
    this.registerForm = this.fb.group({
      tema: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      local: ['', Validators.required],
      dataEvento: ['', Validators.required],
      imagemURL: ['',],
      qtdPessoas: ['', [Validators.required, Validators.max(120000)]],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  editarEvento(evento: Evento, template: any) {
    this.modoSalvar = 'put';
    this.openModal(template);
    this.evento = Object.assign({}, evento);
    this.currentFileName = evento.imagemURL.toString();
    this.evento.imagemURL = '';
    this.registerForm.patchValue(this.evento);
  }

  novoEvento(template: any) {
    this.modoSalvar = 'post'
    this.openModal(template);
  }

  onFileChange(event) {
    //perguntar pq não usa isso?
    //const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      this.file = event.target.files;
      console.log(this.file);
    }
  }

  uploadImagem() {
    const nomeArquivo = this.evento.imagemURL.split('\\', 3);
    this.evento.imagemURL = nomeArquivo[2];
    this.eventoService.postUpload(this.file, nomeArquivo[2]).subscribe(()=>{
      this.getEventos();
    });
  }

  salvarAlteracao(template: any) {
    if (this.registerForm.valid) {
      if (this.modoSalvar === 'post') {
        this.evento = Object.assign({}, this.registerForm.value);

        this.uploadImagem();

        this.eventoService.postEvento(this.evento).subscribe((novoEvento: Evento) => {
          template.hide();
          this.getEventos();
          this.toastr.success('Evento criado com sucesso');
        }, error => {
          this.toastr.error(`Erro ao criar o evento: ${error}`)
        });
      } else {
        this.evento = Object.assign({ id: this.evento.id }, this.registerForm.value);

        if (this.evento.imagemURL != '')
        {
          this.uploadImagem();
        } else {
          this.evento.imagemURL = this.currentFileName;
        }
        console.log("this.evento",this.evento)
        this.eventoService.putEvento(this.evento).subscribe((novoEvento: Evento) => {
          template.hide();
          this.getEventos();
          this.toastr.success('Evento editado com sucesso');
        }, error => {
          this.toastr.error(`Erro ao editar o evento: ${error}`)
          console.log("error", error)
        });
      }

    }
  }

  excluirEvento(evento: Evento, template: any) {
    this.openModal(template);
    this.evento = evento;
    this.bodyDeletarEvento = `Tem certeza que deseja excluir o Evento: ${evento.tema}, Código: ${evento.id}`;
  }

  confirmeDelete(template: any) {
    this.eventoService.deleteEvento(this.evento.id).subscribe(
      () => {
        template.hide();
        this.getEventos();
        this.toastr.success('Excluído com sucesso');
      }, error => {
        this.toastr.error(`Erro ao excluir: ${error}`);
        console.log(error);
      }
    );
  }

  openModal(template: any) {
    this.registerForm.reset();
    template.show();
  }
}
