import axios, { AxiosInstance } from "axios";
import { CardCreateInput, CardCreateResponse } from "./types";
import { Card } from "./types";

import { apiKey } from "../../utils";

export class PagarMe {
  static async createCard(card: CardCreateInput): Promise<Card> {
    const { cardCvv: card_cvv, cardExpirationDate: card_expiration_date, cardHolderName: card_holder_name, cardNumber: card_number } = card;

    const { data: cardResponse } = await this.axiosInstance.post<CardCreateResponse>("cards", {
      card_cvv,
      card_expiration_date,
      card_holder_name,
      card_number
    });

    return {
      pagarmeId: cardResponse.id,
      brand: cardResponse.brand,
      holderName: cardResponse.holder_name,
      expirationDate: cardResponse.expiration_date,
      fingerprint: cardResponse.fingerprint,
      firstDigits: cardResponse.first_digits,
      lastDigits: cardResponse.last_digits,
      valid: cardResponse.valid
    };
  }

  private static "X-Pagarme-Version" = "2017-08-28";

  private static baseUrl: string = "https://api.pagar.me/1/";

  private static apiKey: string = apiKey;

  private static axiosInstance: AxiosInstance = axios.create({
    baseURL: PagarMe.baseUrl,
    headers: { "X-Pagarme-Version": PagarMe["X-Pagarme-Version"] },
    auth: { username: PagarMe.apiKey, password: "x" }
  });
}
