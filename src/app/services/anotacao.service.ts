import { Injectable } from '@angular/core';

import { Anotacao } from '../models/anotacao';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AnotacaoService {

  private readonly chaveAntiga =
    'devpath-anotacoes';

  private readonly prefixoChave =
    'devpath-anotacoes';

  constructor(
    private authService: AuthService
  ) {
    this.migrarAnotacoesAntigas();
  }

  getAnotacoes(): Anotacao[] {
    const chaveUsuario =
      this.getChaveUsuario();

    const dados =
      localStorage.getItem(chaveUsuario);

    if (!dados) {
      return [];
    }

    try {
      const anotacoes = JSON.parse(dados);

      if (!Array.isArray(anotacoes)) {
        return [];
      }

      return anotacoes as Anotacao[];

    } catch (erro) {
      console.error(
        'Erro ao recuperar as anotações:',
        erro
      );

      return [];
    }
  }

  adicionarAnotacao(
    anotacao: Anotacao
  ): void {

    const anotacoes =
      this.getAnotacoes();

    anotacoes.push(anotacao);

    this.salvarAnotacoes(anotacoes);
  }

  atualizarAnotacao(
    anotacaoAtualizada: Anotacao
  ): boolean {

    const anotacoes =
      this.getAnotacoes();

    const indice = anotacoes.findIndex(
      anotacao =>
        anotacao.id === anotacaoAtualizada.id
    );

    if (indice === -1) {
      return false;
    }

    anotacoes[indice] = {
      ...anotacaoAtualizada
    };

    this.salvarAnotacoes(anotacoes);

    return true;
  }

  excluirAnotacao(id: number): void {
    const anotacoesAtualizadas =
      this.getAnotacoes().filter(
        anotacao => anotacao.id !== id
      );

    this.salvarAnotacoes(
      anotacoesAtualizadas
    );
  }

  gerarNovoId(): number {
    const anotacoes =
      this.getAnotacoes();

    if (anotacoes.length === 0) {
      return 1;
    }

    return Math.max(
      ...anotacoes.map(
        anotacao => anotacao.id
      )
    ) + 1;
  }

  excluirTodasAnotacoes(): void {
    const chaveUsuario =
      this.getChaveUsuario();

    localStorage.removeItem(
      chaveUsuario
    );
  }

  private salvarAnotacoes(
    anotacoes: Anotacao[]
  ): void {

    const chaveUsuario =
      this.getChaveUsuario();

    try {
      localStorage.setItem(
        chaveUsuario,
        JSON.stringify(anotacoes)
      );

    } catch (erro) {
      console.error(
        'Erro ao salvar as anotações:',
        erro
      );
    }
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

  private migrarAnotacoesAntigas(): void {
    const dadosAntigos =
      localStorage.getItem(
        this.chaveAntiga
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
      this.getChaveUsuario();

    const dadosUsuario =
      localStorage.getItem(
        chaveUsuario
      );

    if (!dadosUsuario) {
      localStorage.setItem(
        chaveUsuario,
        dadosAntigos
      );
    }

    localStorage.removeItem(
      this.chaveAntiga
    );
  }
}
