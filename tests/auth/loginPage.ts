export class LoginPage {
  private host: string;
  public url: string;

  constructor({ host }: { host: string } = { host: 'http://localhost:3000' }) {
    this.host = host;
    this.url = `${this.host}/login`;
  }
}