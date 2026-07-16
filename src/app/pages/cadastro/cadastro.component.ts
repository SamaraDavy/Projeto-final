import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import {
  AuthService,
  UsuarioCadastro
} from '../../services/auth.service';

import { FooterComponent } from '../../shared/footer/footer.component';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [
  CommonModule,
  FormsModule,
  RouterLink,
  FooterComponent
],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.css'
})
export class CadastroComponent {

  nome = '';
  email = '';
  senha = '';
  confirmarSenha = '';
  aceitouLgpd = false;

  mostrarSenha = false;
  mostrarConfirmacao = false;
  cadastrando = false;

  tiltX = 0;
  tiltY = 0;

  mensagem = '';
  tipoMensagem: 'sucesso' | 'erro' | '' = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  cadastrar(): void {
    if (this.cadastrando) {
      return;
    }

    this.limparMensagem();

    const nome = this.nome.trim();
    const email = this.email
      .trim()
      .toLowerCase();

    if (
      !nome ||
      !email ||
      !this.senha ||
      !this.confirmarSenha
    ) {
      this.exibirMensagem(
        'Preencha todos os campos obrigatórios.',
        'erro'
      );

      return;
    }

    if (nome.length < 3) {
      this.exibirMensagem(
        'Digite um nome completo válido.',
        'erro'
      );

      return;
    }

    if (!this.emailValido(email)) {
      this.exibirMensagem(
        'Digite um endereço de e-mail válido.',
        'erro'
      );

      return;
    }

    if (this.senha.length < 6) {
      this.exibirMensagem(
        'A senha deve possuir pelo menos 6 caracteres.',
        'erro'
      );

      return;
    }

    if (this.senha !== this.confirmarSenha) {
      this.exibirMensagem(
        'As senhas digitadas não são iguais.',
        'erro'
      );

      return;
    }

    if (!this.aceitouLgpd) {
      this.exibirMensagem(
        'Você precisa aceitar os termos de privacidade.',
        'erro'
      );

      return;
    }

    const novoUsuario: UsuarioCadastro = {
      nome,
      email,
      senha: this.senha,
      aceitouLgpd: this.aceitouLgpd,
      dataCadastro: new Date().toISOString()
    };

    this.cadastrando = true;

    const cadastrado =
      this.authService.cadastrar(novoUsuario);

    if (!cadastrado) {
      this.cadastrando = false;

      this.exibirMensagem(
        'Este e-mail já está cadastrado.',
        'erro'
      );

      return;
    }

    this.exibirMensagem(
      'Cadastro realizado com sucesso! Redirecionando para o login...',
      'sucesso'
    );

    setTimeout(() => {
      this.router.navigateByUrl('/login');
    }, 1000);
  }

  alternarSenha(): void {
    this.mostrarSenha = !this.mostrarSenha;
  }

  alternarConfirmacao(): void {
    this.mostrarConfirmacao =
      !this.mostrarConfirmacao;
  }

  aplicarTilt(evento: MouseEvent): void {
    const alvo =
      evento.currentTarget as HTMLElement;

    const retangulo =
      alvo.getBoundingClientRect();

    const centroX =
      retangulo.left + retangulo.width / 2;

    const centroY =
      retangulo.top + retangulo.height / 2;

    const distanciaX =
      (evento.clientX - centroX) /
      (retangulo.width / 2);

    const distanciaY =
      (evento.clientY - centroY) /
      (retangulo.height / 2);

    this.tiltY = distanciaX * 8;
    this.tiltX = distanciaY * -8;
  }

  resetarTilt(): void {
    this.tiltX = 0;
    this.tiltY = 0;
  }

  private emailValido(email: string): boolean {
    const formatoEmail =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return formatoEmail.test(email);
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
