export type Role = 'ADMIN' | 'TEACHER' | 'STUDENT';

export interface Session {
  token: string;
  user: { id: string; email: string; nombres: string; apellidos: string; role: Role };
}

const KEY = 'tj:session';

class AuthStore extends EventTarget {
  #session: Session | null = null;

  constructor() {
    super();
    try {
      this.#session = JSON.parse(localStorage.getItem(KEY) ?? 'null');
    } catch {
      this.#session = null; // sesión corrupta
    }
  }

  get session() { return this.#session; }
  get user() { return this.#session?.user ?? null; }
  get token() { return this.#session?.token ?? null; }
  get isAuthenticated() { return this.#session !== null; }

  login(session: Session) {
    this.#session = session;
    localStorage.setItem(KEY, JSON.stringify(session));
    this.dispatchEvent(new Event('change'));
  }

  logout() {
    this.#session = null;
    localStorage.removeItem(KEY);
    this.dispatchEvent(new Event('change'));
  }
}

export const auth = new AuthStore();