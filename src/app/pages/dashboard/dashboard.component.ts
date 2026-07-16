import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Anotacao } from '../../models/anotacao';

import { AnotacaoService } from '../../services/anotacao.service';
import { AuthService } from '../../services/auth.service';
import { MapaService } from '../../services/mapa.service';

interface PerfilUsuario {
  nome: string;
  curso: string;
  instituicao: string;
  objetivo: string;
  sobre: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  usuario = 'Usuário';

  totalMapas = 0;
  totalAnotacoes = 0;

  ultimoEstudo = 'Nenhum estudo registrado';

  tecnologias: string[] = [];

  progresso = 0;

  constructor(
    private mapaService: MapaService,
    private anotacaoService: AnotacaoService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.carregarPerfil();
    this.carregarDados();
  }

  carregarPerfil(): void {
    const usuarioLogado =
      this.authService.getUsuarioLogado();

    const perfilSalvo =
      this.getPerfilUsuarioLogado();

    if (perfilSalvo?.nome?.trim()) {
      this.usuario =
        this.obterPrimeiroNome(
          perfilSalvo.nome
        );

      return;
    }

    if (usuarioLogado?.nome?.trim()) {
      this.usuario =
        this.obterPrimeiroNome(
          usuarioLogado.nome
        );

      return;
    }

    this.usuario = 'Usuário';
  }

  carregarDados(): void {
    const mapas =
      this.mapaService.getMapas();

    const anotacoes =
      this.anotacaoService.getAnotacoes();

    this.totalMapas = mapas.length;
    this.totalAnotacoes = anotacoes.length;

    this.tecnologias = mapas.map(
      mapa => mapa.titulo
    );

    this.ultimoEstudo =
      this.obterUltimoEstudo(
        anotacoes
      );

    this.calcularProgresso(
      mapas.length,
      anotacoes
    );
  }

  private calcularProgresso(
    totalMapas: number,
    anotacoes: Anotacao[]
  ): void {

    if (totalMapas === 0) {
      this.progresso = 0;
      return;
    }

    const mapasComAnotacao =
      new Set(
        anotacoes.map(
          anotacao => anotacao.mapaId
        )
      ).size;

    this.progresso = Math.round(
      (
        mapasComAnotacao /
        totalMapas
      ) * 100
    );

    this.progresso = Math.min(
      this.progresso,
      100
    );
  }

  private getPerfilUsuarioLogado():
    PerfilUsuario | null {

    const chavePerfil =
      this.getChavePerfilUsuario();

    const dadosPerfil =
      localStorage.getItem(
        chavePerfil
      );

    if (!dadosPerfil) {
      return null;
    }

    try {
      const perfil =
        JSON.parse(
          dadosPerfil
        ) as PerfilUsuario;

      return perfil;

    } catch (erro) {
      console.error(
        'Erro ao carregar o perfil do dashboard:',
        erro
      );

      return null;
    }
  }

  private getChavePerfilUsuario(): string {
    const usuarioLogado =
      this.authService.getUsuarioLogado();

    if (!usuarioLogado?.email) {
      return 'devpath-perfil-usuario-nao-identificado';
    }

    const identificadorUsuario =
      usuarioLogado.email
        .trim()
        .toLowerCase()
        .replace(
          /[^a-z0-9@._-]/g,
          '-'
        );

    return `devpath-perfil-${identificadorUsuario}`;
  }

  private obterPrimeiroNome(
    nomeCompleto: string
  ): string {

    return nomeCompleto
      .trim()
      .split(/\s+/)[0];
  }

  private obterUltimoEstudo(
    anotacoes: Anotacao[]
  ): string {

    if (anotacoes.length === 0) {
      return 'Nenhum estudo registrado';
    }

    const anotacaoMaisRecente =
      [...anotacoes].sort(
        (a, b) =>
          new Date(b.data).getTime() -
          new Date(a.data).getTime()
      )[0];

    return anotacaoMaisRecente.tecnologia;
  }
}
