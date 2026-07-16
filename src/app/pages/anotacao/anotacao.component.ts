import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Anotacao } from '../../models/anotacao';
import { AnotacaoService } from '../../services/anotacao.service';

@Component({
  selector: 'app-anotacao',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './anotacao.component.html',
  styleUrl: './anotacao.component.css'
})
export class AnotacaoComponent implements OnInit {

  tecnologia = '';
  titulo = '';
  conteudo = '';
  data = '';

  mensagem = '';
  tipoMensagem: 'sucesso' | 'erro' | '' = '';

  salvando = false;

  limiteTitulo = 80;
  limiteConteudo = 1000;

  tecnologias = [
    'HTML',
    'CSS',
    'JavaScript',
    'TypeScript',
    'Angular',
    'Git',
    'LGPD'
  ];

  constructor(
    private anotacaoService: AnotacaoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.preencherDataAtual();
  }

  salvar(): void {
    this.limparMensagem();

    if (!this.formularioValido()) {
      this.exibirMensagem(
        'Preencha todos os campos obrigatórios.',
        'erro'
      );

      return;
    }

    this.salvando = true;

    const novaAnotacao: Anotacao = {
      id: Date.now(),
      mapaId: 0,
      tecnologia: this.tecnologia,
      titulo: this.titulo.trim(),
      conteudo: this.conteudo.trim(),
      data: this.data
    };

    this.anotacaoService.adicionarAnotacao(novaAnotacao);

    this.exibirMensagem(
      'Anotação salva com sucesso!',
      'sucesso'
    );

    setTimeout(() => {
      this.router.navigate(['/mapas']);
    }, 900);
  }

  cancelar(): void {
    const formularioPreenchido =
      this.tecnologia ||
      this.titulo.trim() ||
      this.conteudo.trim();

    if (formularioPreenchido) {
      const confirmar = confirm(
        'Deseja sair sem salvar esta anotação?'
      );

      if (!confirmar) {
        return;
      }
    }

    this.router.navigate(['/mapas']);
  }

  formularioValido(): boolean {
    return Boolean(
      this.tecnologia &&
      this.titulo.trim() &&
      this.conteudo.trim() &&
      this.data
    );
  }

  get quantidadeTitulo(): number {
    return this.titulo.length;
  }

  get quantidadeConteudo(): number {
    return this.conteudo.length;
  }

  private preencherDataAtual(): void {
    const hoje = new Date();

    const ano = hoje.getFullYear();
    const mes = String(
      hoje.getMonth() + 1
    ).padStart(2, '0');

    const dia = String(
      hoje.getDate()
    ).padStart(2, '0');

    this.data = `${ano}-${mes}-${dia}`;
  }

  private exibirMensagem(
    mensagem: string,
    tipo: 'sucesso' | 'erro'
  ): void {
    this.mensagem = mensagem;
    this.tipoMensagem = tipo;
  }

  private limparMensagem(): void {
    this.mensagem = '';
    this.tipoMensagem = '';
  }
}
