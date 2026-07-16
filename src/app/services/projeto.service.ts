import { Injectable } from '@angular/core';
import { Projeto } from '../models/projeto';

@Injectable({
  providedIn: 'root'
})
export class ProjetoService {

  private chave = 'projetos';

  listar(): Projeto[] {
    return JSON.parse(localStorage.getItem(this.chave) || '[]');
  }

  salvar(lista: Projeto[]) {
    localStorage.setItem(this.chave, JSON.stringify(lista));
  }

  adicionar(projeto: Projeto) {
    const lista = this.listar();
    lista.push(projeto);
    this.salvar(lista);
  }

}
