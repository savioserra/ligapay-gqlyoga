export const typeDefs = `
scalar DateTime
scalar UUID

type User {
  id: UUID!
  email: String!

  team: Team!
  wallet: Wallet!

  createdAt: DateTime!
  updatedAt: DateTime!
  deleted: Boolean!
}

type League {
  id: UUID!
  name: String!
  """ Taxa de administração. """
  adminTax: Int!
  """ Url para o avatar. """
  avatar: String
  description: String
  """ Taxa de inscrição. """
  fee: Int!
  """ Número máximo permitido de times. """
  limit: Int!
  """ Carteira da Liga. """
  wallet: Wallet!
  """ Tipo de Liga. """
  leagueType: LeagueType!
  """ Inscrições da Liga nas Temporadas. """
  enrollments: [LeagueEnrollment]

  createdAt: DateTime!
  updatedAt: DateTime!
  deleted: Boolean!
}

type LeagueType {
  id: UUID!
  name: String!
  description: String

  leagues: [League]

  createdAt: DateTime
  updatedAt: DateTime!
  deleted: Boolean!
}

type Score {
  id: UUID!
  score: Float!

  """ Rodada. """
  round: Int!
  """ Temporada. """
  season: Season!

  createdAt: DateTime!
  updatedAt: DateTime!
}

type Season {
  id: UUID!
  name: String!
  description: String

  """ Rodada atual. """
  currentRound: Int!
  """ Verdadeiro se é a temporada atual, Falso caso contrário. """
  current: Boolean!

  """ Inscrições das ligas na temporada. """
  leaguesEnrollments: [LeagueEnrollment]

  createdAt: DateTime!
  updatedAt: DateTime!
}

type TeamEnrollment {
  id: UUID!
  fee: Int!

  leagueEnrollment: LeagueEnrollment!
  team: Team!

  updatedAt: DateTime
  createdAt: DateTime
}

type Team {
  id: UUID!
  name: String!
  cartolaName: String!
  cartolaSlug: String!
  avatar: String

  scores: [Score!]!
  owner: User!

  """ Inscrições em ligas. """
  enrollments: [TeamEnrollment!]!

  createdAt: DateTime
  updatedAt: DateTime
  deleted: Boolean!
}

type Transaction {
  id: UUID!
  amount: Int!

  destination: Wallet!
  origin: Wallet!

  createdAt: DateTime!
  updatedAt: DateTime!
}

type Wallet {
  id: UUID!
  amount: Int!
  user: User
  league: League
  transactions: [Transaction]!

  createdAt: DateTime!
  updatedAt: DateTime!
}

type LeagueEnrollment {
  id: UUID!

  league: League!
  season: Season!

  createdAt: DateTime!
  updatedAt: DateTime!
}

type Query {
  users: [User!]!
  """ Obtem dados do usuário logado. """
  me: User!
}

type TransactionPayload {
  """ Indica se a transação obteve sucesso. """
  success: Boolean!
  """ Informação adicional sobre a transação. """
  info: String!
}

type AuthPayload {
  token: String
  info: String!
  user: User
}

type Mutation {
  """ Cria uma transação financeira entre duas carteiras. """
  createTransaction(origin: UUID!, destination: UUID!, amount: Int!): TransactionPayload!

  """ Cria um novo usuário caso não exista usando a Api do Cartola ou loga caso contrário. """
  login(email: String!, password: String!): AuthPayload!
}

type Subscription {
  count: Int!
}
`;
