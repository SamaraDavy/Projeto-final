import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../services/auth.service';

interface PerfilUsuario {
  nome: string;
  curso: string;
  instituicao: string;
  objetivo: string;
  sobre: string;
}

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit {

  perfil: PerfilUsuario = {
    nome: '',
    curso: '',
    instituicao: '',
    objetivo: '',
    sobre: ''
  };

  mensagem = '';

  private readonly chavePerfilAntiga =
    'devpath-perfil';

  private readonly prefixoChavePerfil =
    'devpath-perfil';

  constructor(
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.migrarPerfilAntigo();
    this.carregarPerfil();
  }

  salvarPerfil(): void {
    const chaveUsuario =
      this.getChavePerfilUsuario();

    const perfilParaSalvar: PerfilUsuario = {
      nome: this.perfil.nome.trim(),
      curso: this.perfil.curso.trim(),
      instituicao: this.perfil.instituicao.trim(),
      objetivo: this.perfil.objetivo.trim(),
      sobre: this.perfil.sobre.trim()
    };

    try {
      localStorage.setItem(
        chaveUsuario,
        JSON.stringify(perfilParaSalvar)
      );

      this.perfil = perfilParaSalvar;

      this.exibirMensagem(
        'Perfil salvo com sucesso!'
      );

    } catch (erro) {
      console.error(
        'Erro ao salvar o perfil:',
        erro
      );

      this.exibirMensagem(
        'Não foi possível salvar o perfil.'
      );
    }
  }

  limparPerfil(): void {
    const confirmar = confirm(
      'Deseja realmente limpar os dados do perfil?'
    );

    if (!confirmar) {
      return;
    }

    const chaveUsuario =
      this.getChavePerfilUsuario();

    localStorage.removeItem(
      chaveUsuario
    );

    const usuarioLogado =
      this.authService.getUsuarioLogado();

    this.perfil = {
      nome: usuarioLogado?.nome || '',
      curso: '',
      instituicao: '',
      objetivo: '',
      sobre: ''
    };

    this.exibirMensagem(
      'Perfil limpo com sucesso!'
    );
  }

  carregarPerfil(): void {
    const chaveUsuario =
      this.getChavePerfilUsuario();

    const dados =
      localStorage.getItem(chaveUsuario);

    if (!dados) {
      this.preencherNomeUsuarioLogado();
      return;
    }

    try {
      const perfilSalvo =
        JSON.parse(dados) as Partial<PerfilUsuario>;

      this.perfil = {
        nome: perfilSalvo.nome || '',
        curso: perfilSalvo.curso || '',
        instituicao: perfilSalvo.instituicao || '',
        objetivo: perfilSalvo.objetivo || '',
        sobre: perfilSalvo.sobre || ''
      };

    } catch (erro) {
      console.error(
        'Erro ao carregar o perfil:',
        erro
      );

      localStorage.removeItem(
        chaveUsuario
      );

      this.preencherNomeUsuarioLogado();
    }
  }

  getIniciais(): string {
    const nome = this.perfil.nome.trim();

    if (!nome) {
      return 'US';
    }

    return nome
      .split(/\s+/)
      .slice(0, 2)
      .map(
        parte =>
          parte.charAt(0).toUpperCase()
      )
      .join('');
  }

  private preencherNomeUsuarioLogado(): void {
    const usuarioLogado =
      this.authService.getUsuarioLogado();

    this.perfil = {
      nome: usuarioLogado?.nome || '',
      curso: '',
      instituicao: '',
      objetivo: '',
      sobre: ''
    };
  }

  private getChavePerfilUsuario(): string {
    const usuarioLogado =
      this.authService.getUsuarioLogado();

    if (!usuarioLogado?.email) {
      return `${this.prefixoChavePerfil}-usuario-nao-identificado`;
    }

    const identificadorUsuario =
      usuarioLogado.email
        .trim()
        .toLowerCase()
        .replace(
          /[^a-z0-9@._-]/g,
          '-'
        );

    return `${this.prefixoChavePerfil}-${identificadorUsuario}`;
  }

  private migrarPerfilAntigo(): void {
    const dadosAntigos =
      localStorage.getItem(
        this.chavePerfilAntiga
      );

    if (!dadosAntigos) {
      return;
    }

    const usuarioLogado =
      this.authService.getUsuarioLogado();

    if (!usuarioLogado?.email) {
      return;
    }

    const chaveUsuario =
      this.getChavePerfilUsuario();

    const perfilUsuario =
      localStorage.getItem(
        chaveUsuario
      );

    if (!perfilUsuario) {
      localStorage.setItem(
        chaveUsuario,
        dadosAntigos
      );
    }

    localStorage.removeItem(
      this.chavePerfilAntiga
    );
  }

  private exibirMensagem(
    texto: string
  ): void {
    this.mensagem = texto;

    setTimeout(() => {
      this.mensagem = '';
    }, 2500);
  }
}
