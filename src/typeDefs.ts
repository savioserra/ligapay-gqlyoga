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
  score: Int!

  season: Season!
  team: Team!

  createdAt: DateTime!
  updatedAt: DateTime!
}

type Season {
  id: UUID!
  name: String!
  description: String

  scores: [Score]
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
  avatar: String

  scores: [Score]
  owner: User!
  enrollments: [TeamEnrollment]

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
  incomingTransactions: [Transaction]
  outgoingTransactions: [Transaction]

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
}

type TransactionPayload {
  """ Indica se a transação obteve sucesso. """
  success: Boolean!
  """ Informação adicional sobre a transação. """
  info: String!
}

type Mutation {
  createUser: User
  """ Cria uma transação financeira entre duas carteiras. """
  createTransaction(origin: UUID!, destination: UUID!, amount: Int!): TransactionPayload!
}`;
