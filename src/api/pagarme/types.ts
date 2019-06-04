export interface CardCreateInput {
  cardNumber: string;
  cardExpirationDate: string;
  cardHolderName: string;
  cardCvv: string;
}

export interface CardCreateResponse {
  object: string;
  id: string;
  date_created: string;
  date_updated: string;
  brand: string;
  holder_name: string;
  first_digits: string;
  last_digits: string;
  fingerprint: string;
  valid: boolean;
  expiration_date: string;
}

export interface Card {
  pagarmeId: string;
  brand: string;
  holderName: string;
  firstDigits: string;
  lastDigits: string;
  fingerprint: string;
  valid: boolean;
  expirationDate: string;
}
