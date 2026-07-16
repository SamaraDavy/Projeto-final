import { CommonModule } from '@angular/common';
import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  Router,
  RouterLink
} from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { FooterComponent } from '../../shared/footer/footer.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    FooterComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, OnDestroy {

  usuario = '';
  senha = '';
  mensagem = '';
  mostrarSenha = false;
  slideAtual = 0;

  tiltX = 0;
  tiltY = 0;

  private intervaloCarrossel?: number;

  slides = [
    {
      tecnologia: 'HTML',
      titulo: 'Estruture suas ideias',
      descricao:
        'Organize os fundamentos e acompanhe sua evolução nos estudos.',
      imagem: '/imagens/tecnologias/HTML.svg'
    },
    {
      tecnologia: 'CSS',
      titulo: 'Crie experiências visuais',
      descricao:
        'Registre seus aprendizados sobre estilos, layouts e responsividade.',
      imagem: '/imagens/tecnologias/css.svg'
    },
    {
      tecnologia: 'JavaScript',
      titulo: 'Desenvolva interatividade',
      descricao:
        'Salve anotações e acompanhe sua evolução com JavaScript.',
      imagem: '/imagens/tecnologias/javascript.svg'
    },
    {
      tecnologia: 'TypeScript',
      titulo: 'Escreva códigos mais seguros',
      descricao:
        'Organize seus conhecimentos e fortaleça seus fundamentos.',
      imagem: '/imagens/tecnologias/typescript.svg'
    },
    {
      tecnologia: 'Angular',
      titulo: 'Construa aplicações modernas',
      descricao:
        'Registre conteúdos importantes durante sua jornada com Angular.',
      imagem: '/imagens/tecnologias/angular.svg'
    }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.iniciarCarrosselAutomatico();
  }

  ngOnDestroy(): void {
    this.pararCarrosselAutomatico();
  }

  entrar(): void {
    this.mensagem = '';

    if (!this.usuario.trim() || !this.senha.trim()) {
      this.mensagem = 'Preencha o usuário e a senha.';
      return;
    }

    const loginRealizado = this.authService.login(
      this.usuario.trim(),
      this.senha
    );

    if (loginRealizado) {
      this.router.navigate(['/dashboard']);
      return;
    }

    this.mensagem = 'Usuário ou senha incorretos.';
  }

  alternarSenha(): void {
    this.mostrarSenha = !this.mostrarSenha;
  }

  aplicarTilt(evento: MouseEvent): void {
    const alvo = evento.currentTarget as HTMLElement;
    const retangulo = alvo.getBoundingClientRect();

    const centroX = retangulo.left + retangulo.width / 2;
    const centroY = retangulo.top + retangulo.height / 2;

    const distanciaX = (evento.clientX - centroX) / (retangulo.width / 2);
    const distanciaY = (evento.clientY - centroY) / (retangulo.height / 2);

    this.tiltY = distanciaX * 8;
    this.tiltX = distanciaY * -8;
  }

  resetarTilt(): void {
    this.tiltX = 0;
    this.tiltY = 0;
  }

  proximoSlide(): void {
    this.slideAtual =
      (this.slideAtual + 1) % this.slides.length;

    this.reiniciarCarrosselAutomatico();
  }

  slideAnterior(): void {
    this.slideAtual =
      (this.slideAtual - 1 + this.slides.length) %
      this.slides.length;

    this.reiniciarCarrosselAutomatico();
  }

  selecionarSlide(indice: number): void {
    this.slideAtual = indice;

    this.reiniciarCarrosselAutomatico();
  }

  private iniciarCarrosselAutomatico(): void {
    this.pararCarrosselAutomatico();

    this.intervaloCarrossel = window.setInterval(() => {
      this.avancarSlideAutomaticamente();
    }, 4000);
  }

  private avancarSlideAutomaticamente(): void {
    this.slideAtual =
      (this.slideAtual + 1) % this.slides.length;
  }

  private reiniciarCarrosselAutomatico(): void {
    this.iniciarCarrosselAutomatico();
  }

  private pararCarrosselAutomatico(): void {
    if (this.intervaloCarrossel !== undefined) {
      window.clearInterval(this.intervaloCarrossel);
      this.intervaloCarrossel = undefined;
    }
  }
}
