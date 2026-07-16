import { Injectable } from '@angular/core';

export interface UsuarioCadastro {
  nome: string;
  email: string;
  senha: string;
  aceitouLgpd: boolean;
  dataCadastro: string;
}

export interface UsuarioLogado {
  nome: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly chaveUsuarios = 'devpath-usuarios';
  private readonly chaveUsuarioLogado = 'devpath-usuario-logado';

  cadastrar(usuario: UsuarioCadastro): boolean {
    const usuarios = this.getUsuarios();

    const emailNormalizado =
      usuario.email.trim().toLowerCase();

    const emailExiste = usuarios.some(
      item =>
        item.email?.trim().toLowerCase() ===
        emailNormalizado
    );

    if (emailExiste) {
      return false;
    }

    const novoUsuario: UsuarioCadastro = {
      nome: usuario.nome.trim(),
      email: emailNormalizado,
      senha: usuario.senha,
      aceitouLgpd: usuario.aceitouLgpd,
      dataCadastro: usuario.dataCadastro
    };

    usuarios.push(novoUsuario);

    try {
      localStorage.setItem(
        this.chaveUsuarios,
        JSON.stringify(usuarios)
      );

      return true;

    } catch (erro) {
      console.error(
        'Erro ao salvar o usuário:',
        erro
      );

      return false;
    }
  }

  login(email: string, senha: string): boolean {
    const usuarios = this.getUsuarios();

    const emailNormalizado =
      email.trim().toLowerCase();

    const usuarioEncontrado = usuarios.find(
      item =>
        item.email?.trim().toLowerCase() ===
          emailNormalizado &&
        item.senha === senha
    );

    if (!usuarioEncontrado) {
      return false;
    }

    const usuarioLogado: UsuarioLogado = {
      nome: usuarioEncontrado.nome,
      email: usuarioEncontrado.email
    };

    try {
      localStorage.setItem(
        this.chaveUsuarioLogado,
        JSON.stringify(usuarioLogado)
      );

      return true;

    } catch (erro) {
      console.error(
        'Erro ao realizar login:',
        erro
      );

      return false;
    }
  }

  logout(): void {
    localStorage.removeItem(
      this.chaveUsuarioLogado
    );
  }

  isAuthenticated(): boolean {
    return this.getUsuarioLogado() !== null;
  }

  getUsuarioLogado(): UsuarioLogado | null {
    const dados = localStorage.getItem(
      this.chaveUsuarioLogado
    );

    if (!dados) {
      return null;
    }

    try {
      const usuario = JSON.parse(dados);

      if (
        !usuario ||
        typeof usuario !== 'object' ||
        typeof usuario.nome !== 'string' ||
        typeof usuario.email !== 'string'
      ) {
        localStorage.removeItem(
          this.chaveUsuarioLogado
        );

        return null;
      }

      return usuario as UsuarioLogado;

    } catch (erro) {
      console.error(
        'Erro ao recuperar usuário logado:',
        erro
      );

      localStorage.removeItem(
        this.chaveUsuarioLogado
      );

      return null;
    }
  }

  getUsuarios(): UsuarioCadastro[] {
    const dados = localStorage.getItem(
      this.chaveUsuarios
    );

    if (!dados) {
      return [];
    }

    try {
      const usuarios = JSON.parse(dados);

      if (!Array.isArray(usuarios)) {
        localStorage.removeItem(
          this.chaveUsuarios
        );

        return [];
      }

      return usuarios.filter(
        item =>
          item &&
          typeof item === 'object' &&
          typeof item.nome === 'string' &&
          typeof item.email === 'string' &&
          typeof item.senha === 'string'
      );

    } catch (erro) {
      console.error(
        'Erro ao recuperar usuários:',
        erro
      );

      localStorage.removeItem(
        this.chaveUsuarios
      );

      return [];
    }
  }

  excluirConta(email: string): void {
    const usuarios = this.getUsuarios();

    const emailNormalizado =
      email.trim().toLowerCase();

    const usuariosAtualizados = usuarios.filter(
      item =>
        item.email.trim().toLowerCase() !==
        emailNormalizado
    );

    localStorage.setItem(
      this.chaveUsuarios,
      JSON.stringify(usuariosAtualizados)
    );

    this.logout();
  }
}
