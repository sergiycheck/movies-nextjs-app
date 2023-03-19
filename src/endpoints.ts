export const baseUrl = process.env.NEXT_PUBLIC_WEB_API_URL;

export const endpoints = {
  users: {
    name: `${baseUrl}/users`,
  },
  sessions: {
    name: `${baseUrl}/sessions`,
  },

  movies: {
    name: `${baseUrl}/movies`,

    byId(id: string) {
      return `${this.name}/${id}`;
    },
    list(sort: string) {
      return `${this.name}?${sort}`;
    },
    get import() {
      return `${this.name}/import`;
    },
  },
};
