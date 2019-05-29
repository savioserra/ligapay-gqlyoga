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
    try {
      const { data } = await this.axiosInstance.get("auth/time", {
        headers: { "X-GLB-Token": globoToken }
      });

      const { nome_cartola: cartolaName, nome: name, slug: cartolaSlug, url_escudo_png: avatar } = data.time;

      return { cartolaName, name, cartolaSlug, avatar };
    } catch (error) {
      return null;
    }
  }

  public static async getCurrentRound(): Promise<number> {
    try {
      const { data } = await this.axiosInstance.get("mercado/status");
      const { rodada_atual: currentRound } = data;

      return currentRound;
    } catch (error) {
      return null;
    }
  }

  public static async getTeamScores(teamSlug: string): Promise<{ round: number; score: number }[]> {
    const round = await this.getCurrentRound();

    return Promise.all(
      range(1, round).map(async round => {
        const { data } = await this.axiosInstance.get(`time/slug/${teamSlug}/${round}`);
        const { pontos } = data;

        return pontos ? { round, score: pontos } : null;
      })
    );
  }

  private static serviceId: number = 4728;
  private static baseUrl: string = "https://api.cartolafc.globo.com/";
  private static axiosInstance: AxiosInstance = axios.create({ baseURL: Cartola.baseUrl });
}
