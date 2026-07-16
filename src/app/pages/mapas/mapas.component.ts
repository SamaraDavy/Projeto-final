import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { Anotacao } from '../../models/anotacao';
import { Mapa } from '../../models/mapa';

import { AnotacaoService } from '../../services/anotacao.service';
import { MapaService } from '../../services/mapa.service';

@Component({
  selector: 'app-mapas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './mapas.component.html',
  styleUrl: './mapas.component.css'
})
export class MapasComponent implements OnInit {

  mapas: Mapa[] = [];
  anotacoes: Anotacao[] = [];

  tecnologiasExpandidas: string[] = [];

  anotacaoEmEdicaoId: number | null = null;

  tecnologiaEdicao = '';
  tituloEdicao = '';
  conteudoEdicao = '';
  dataEdicao = '';

  mensagem = '';
  tipoMensagem: 'sucesso' | 'erro' | '' = '';

  constructor(
    private mapaService: MapaService,
    private anotacaoService: AnotacaoService
  ) {}

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    this.carregarMapas();
    this.carregarAnotacoes();
  }

  carregarMapas(): void {
    this.mapas = this.mapaService.getMapas();
  }

  carregarAnotacoes(): void {
    this.anotacoes =
      this.anotacaoService.getAnotacoes();
  }

  getAnotacoesPorTecnologia(
    tecnologia: string
  ): Anotacao[] {

    return this.anotacoes.filter(
      anotacao =>
        anotacao.tecnologia === tecnologia
    );
  }

  getAnotacoesVisiveis(
    tecnologia: string
  ): Anotacao[] {

    const anotacoesDaTecnologia =
      this.getAnotacoesPorTecnologia(tecnologia);

    if (this.estaExpandida(tecnologia)) {
      return anotacoesDaTecnologia;
    }

    return anotacoesDaTecnologia.slice(0, 1);
  }

  getQuantidadeAnotacoes(
    tecnologia: string
  ): number {

    return this.getAnotacoesPorTecnologia(
      tecnologia
    ).length;
  }

  getQuantidadeOculta(
    tecnologia: string
  ): number {

    return Math.max(
      this.getQuantidadeAnotacoes(tecnologia) - 1,
      0
    );
  }

  alternarAnotacoes(
    tecnologia: string
  ): void {

    const indice =
      this.tecnologiasExpandidas.indexOf(tecnologia);

    if (indice >= 0) {
      this.tecnologiasExpandidas.splice(indice, 1);

      return;
    }

    this.tecnologiasExpandidas.push(tecnologia);
  }

  estaExpandida(
    tecnologia: string
  ): boolean {

    return this.tecnologiasExpandidas.includes(
      tecnologia
    );
  }

  getProgresso(
    tecnologia: string
  ): number {

    const quantidade =
      this.getQuantidadeAnotacoes(tecnologia);

    return Math.min(
      quantidade * 20,
      100
    );
  }

  iniciarEdicao(
    anotacao: Anotacao
  ): void {

    this.anotacaoEmEdicaoId = anotacao.id;

    this.tecnologiaEdicao =
      anotacao.tecnologia;

    this.tituloEdicao =
      anotacao.titulo;

    this.conteudoEdicao =
      anotacao.conteudo;

    this.dataEdicao =
      anotacao.data;

    this.limparMensagem();
  }

  salvarEdicao(
    anotacao: Anotacao
  ): void {

    this.limparMensagem();

    if (
      !this.tecnologiaEdicao ||
      !this.tituloEdicao.trim() ||
      !this.conteudoEdicao.trim() ||
      !this.dataEdicao
    ) {
      this.exibirMensagem(
        'Preencha todos os campos da anotação.',
        'erro'
      );

      return;
    }

    const anotacaoAtualizada: Anotacao = {
      ...anotacao,
      tecnologia: this.tecnologiaEdicao,
      titulo: this.tituloEdicao.trim(),
      conteudo: this.conteudoEdicao.trim(),
      data: this.dataEdicao
    };

    const atualizou =
      this.anotacaoService.atualizarAnotacao(
        anotacaoAtualizada
      );

    if (!atualizou) {
      this.exibirMensagem(
        'Não foi possível atualizar a anotação.',
        'erro'
      );

      return;
    }

    this.carregarAnotacoes();
    this.cancelarEdicao();

    this.exibirMensagem(
      'Anotação atualizada com sucesso!',
      'sucesso'
    );
  }

  cancelarEdicao(): void {
    this.anotacaoEmEdicaoId = null;

    this.tecnologiaEdicao = '';
    this.tituloEdicao = '';
    this.conteudoEdicao = '';
    this.dataEdicao = '';
  }

  excluirAnotacao(
    id: number
  ): void {

    const confirmar = confirm(
      'Deseja realmente excluir esta anotação?'
    );

    if (!confirmar) {
      return;
    }

    this.anotacaoService.excluirAnotacao(id);

    if (this.anotacaoEmEdicaoId === id) {
      this.cancelarEdicao();
    }

    this.carregarAnotacoes();

    this.exibirMensagem(
      'Anotação excluída com sucesso!',
      'sucesso'
    );
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
