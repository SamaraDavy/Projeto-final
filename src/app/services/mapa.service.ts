import { Injectable } from '@angular/core';

import { Mapa } from '../models/mapa';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MapaService {

  private readonly chaveAntiga = 'devpath-mapas';
  private readonly prefixoChave = 'devpath-mapas';

  private readonly mapasPadrao: Mapa[] = [
    {
      id: 1,
      titulo: 'HTML',
      descricao: 'Anotações sobre HTML',
      categoria: 'Front-end',
      cor: '#E34F26',
      icone: '/imagens/tecnologias/HTML.svg'
    },
    {
      id: 2,
      titulo: 'CSS',
      descricao: 'Anotações sobre CSS',
      categoria: 'Front-end',
      cor: '#1572B6',
      icone: '/imagens/tecnologias/css.svg'
    },
    {
      id: 3,
      titulo: 'JavaScript',
      descricao: 'Anotações sobre JavaScript',
      categoria: 'Front-end',
      cor: '#F7DF1E',
      icone: '/imagens/tecnologias/javascript.svg'
    },
    {
      id: 4,
      titulo: 'TypeScript',
      descricao: 'Anotações sobre TypeScript',
      categoria: 'Front-end',
      cor: '#3178C6',
      icone: '/imagens/tecnologias/typescript.svg'
    },
    {
      id: 5,
      titulo: 'Angular',
      descricao: 'Anotações sobre Angular',
      categoria: 'Framework',
      cor: '#DD0031',
      icone: '/imagens/tecnologias/angular.svg'
    }
  ];

  constructor(
    private authService: AuthService
  ) {}

  getMapas(): Mapa[] {
    this.inicializarMapasUsuario();

    const chaveUsuario = this.getChaveUsuario();
    const dados = localStorage.getItem(chaveUsuario);

    if (!dados) {
      return [];
    }

    try {
      const mapasSalvos = JSON.parse(dados) as Mapa[];

      if (!Array.isArray(mapasSalvos)) {
        return [];
      }

      const mapasAtualizados = mapasSalvos.map(mapa => {
        const mapaPadrao = this.mapasPadrao.find(
          item => item.id === mapa.id
        );

        return {
          ...mapa,
          icone: mapaPadrao?.icone || mapa.icone || ''
        };
      });

      this.salvarMapas(mapasAtualizados);

      return mapasAtualizados;

    } catch (erro) {
      console.error(
        'Erro ao recuperar os mapas:',
        erro
      );

      return [];
    }
  }

  adicionarMapa(mapa: Mapa): void {
    const mapas = this.getMapas();

    mapas.push(mapa);

    this.salvarMapas(mapas);
  }

  atualizarMapa(
    mapaAtualizado: Mapa
  ): boolean {

    const mapas = this.getMapas();

    const indice = mapas.findIndex(
      mapa => mapa.id === mapaAtualizado.id
    );

    if (indice === -1) {
      return false;
    }

    mapas[indice] = mapaAtualizado;

    this.salvarMapas(mapas);

    return true;
  }

  excluirMapa(id: number): void {
    const mapasAtualizados = this
      .getMapas()
      .filter(
        mapa => mapa.id !== id
      );

    this.salvarMapas(mapasAtualizados);
  }

  gerarNovoId(): number {
    const mapas = this.getMapas();

    if (mapas.length === 0) {
      return 1;
    }

    return Math.max(
      ...mapas.map(mapa => mapa.id)
    ) + 1;
  }

  private inicializarMapasUsuario(): void {
    const chaveUsuario = this.getChaveUsuario();

    const dadosUsuario = localStorage.getItem(
      chaveUsuario
    );

    if (dadosUsuario) {
      return;
    }

    const dadosAntigos = localStorage.getItem(
      this.chaveAntiga
    );

    if (dadosAntigos) {
      localStorage.setItem(
        chaveUsuario,
        dadosAntigos
      );

      localStorage.removeItem(
        this.chaveAntiga
      );

      return;
    }

    const mapasIniciais = this.mapasPadrao.map(
      mapa => ({ ...mapa })
    );

    this.salvarMapas(mapasIniciais);
  }

  private salvarMapas(
    mapas: Mapa[]
  ): void {

    const chaveUsuario = this.getChaveUsuario();

    localStorage.setItem(
      chaveUsuario,
      JSON.stringify(mapas)
    );
  }

  private getChaveUsuario(): string {
    const usuarioLogado =
      this.authService.getUsuarioLogado();

    if (!usuarioLogado?.email) {
      return `${this.prefixoChave}-usuario-nao-identificado`;
    }

    const identificadorUsuario =
      usuarioLogado.email
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9@._-]/g, '-');

    return `${this.prefixoChave}-${identificadorUsuario}`;
  }
}
