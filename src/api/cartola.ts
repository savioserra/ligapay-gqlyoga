import axios, { AxiosInstance } from "axios";
import { Score } from "../prisma";
import { range } from "lodash";

export class Cartola {
  public static async login(email: string, password: string): Promise<{ token?: string }> {
    try {
      const { data } = await axios.post("https://login.globo.com/api/authentication", {
        payload: { email, password, serviceId: this.serviceId }
      });

      return { token: data.glbId };
    } catch (error) {
      return { token: null };
    }
  }

  public static async getTeam(globoToken: string) {
    const { data } = await this.axiosInstance.get("auth/time", {
      headers: { "X-GLB-Token": globoToken }
    });

    const { nome_cartola: cartolaName, nome: name, slug: cartolaSlug, url_escudo_png: avatar } = data.time;

    return { cartolaName, name, cartolaSlug, avatar };
  }

  public static async getCurrentRound(): Promise<number> {
    try {
      const { data } = await this.axiosInstance.get("mercado/status");
      const { rodada_atual: currentRound, status_mercado: isOpen } = data;

      return isOpen ? currentRound - 1 : currentRound;
    } catch (error) {
      return null;
    }
  }

  public static async getTeamScores(teamSlug: string): Promise<{ round: number; score: number }[]> {
    const round = await this.getCurrentRound();

    const scores = await Promise.all(
      range(1, round + 1).map(async round => {
        const { data } = await this.axiosInstance.get(`time/slug/${teamSlug}/${round}`);
        const { pontos } = data;

        return pontos ? { round, score: pontos } : null;
      })
    );

    return scores.filter(s => s !== null);
  }

  private static serviceId: number = 4728;
  private static baseUrl: string = "https://api.cartolafc.globo.com/";
  private static axiosInstance: AxiosInstance = axios.create({ baseURL: Cartola.baseUrl });
}
