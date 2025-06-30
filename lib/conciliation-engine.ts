// Engine de Conciliação - Lógica principal do sistema

export interface Transaction {
  id: string
  date: Date
  description: string
  amount: number
  document?: string
  source: "bank" | "system"
  category?: string
  metadata?: Record<string, any>
}

export interface MatchResult {
  bankTransaction: Transaction
  systemTransaction: Transaction
  confidence: number
  matchType: "exact" | "fuzzy" | "manual"
  criteria: string[]
}

export interface ConciliationConfig {
  dateToleranceDays: number
  amountTolerancePercent: number
  descriptionSimilarityThreshold: number
  enableFuzzyMatching: boolean
  priorityFields: string[]
}

export class ConciliationEngine {
  private config: ConciliationConfig

  constructor(config: ConciliationConfig) {
    this.config = config
  }

  /**
   * Executa o processo completo de conciliação
   */
  async reconcile(
    bankTransactions: Transaction[],
    systemTransactions: Transaction[],
  ): Promise<{
    matches: MatchResult[]
    unmatchedBank: Transaction[]
    unmatchedSystem: Transaction[]
    possibleMatches: Array<{
      bankTransaction: Transaction
      possibleSystemMatches: Array<{ transaction: Transaction; confidence: number }>
    }>
  }> {
    const matches: MatchResult[] = []
    const unmatchedBank: Transaction[] = []
    const unmatchedSystem: Transaction[] = [...systemTransactions]
    const possibleMatches: Array<{
      bankTransaction: Transaction
      possibleSystemMatches: Array<{ transaction: Transaction; confidence: number }>
    }> = []

    for (const bankTx of bankTransactions) {
      const exactMatch = this.findExactMatch(bankTx, unmatchedSystem)

      if (exactMatch) {
        matches.push({
          bankTransaction: bankTx,
          systemTransaction: exactMatch,
          confidence: 1.0,
          matchType: "exact",
          criteria: ["amount", "date", "document"],
        })

        // Remove da lista de não conciliadas
        const index = unmatchedSystem.indexOf(exactMatch)
        unmatchedSystem.splice(index, 1)
        continue
      }

      // Busca matches fuzzy se habilitado
      if (this.config.enableFuzzyMatching) {
        const fuzzyMatches = this.findFuzzyMatches(bankTx, unmatchedSystem)

        if (fuzzyMatches.length > 0) {
          const bestMatch = fuzzyMatches[0]

          if (bestMatch.confidence > 0.8) {
            matches.push({
              bankTransaction: bankTx,
              systemTransaction: bestMatch.transaction,
              confidence: bestMatch.confidence,
              matchType: "fuzzy",
              criteria: this.getMatchCriteria(bankTx, bestMatch.transaction),
            })

            const index = unmatchedSystem.indexOf(bestMatch.transaction)
            unmatchedSystem.splice(index, 1)
            continue
          } else if (bestMatch.confidence > 0.5) {
            possibleMatches.push({
              bankTransaction: bankTx,
              possibleSystemMatches: fuzzyMatches,
            })
          }
        }
      }

      unmatchedBank.push(bankTx)
    }

    return {
      matches,
      unmatchedBank,
      unmatchedSystem,
      possibleMatches,
    }
  }

  /**
   * Encontra match exato baseado em critérios rígidos
   */
  private findExactMatch(bankTx: Transaction, systemTransactions: Transaction[]): Transaction | null {
    return (
      systemTransactions.find((sysTx) => {
        // Valor exato
        if (Math.abs(bankTx.amount - sysTx.amount) > 0.01) return false

        // Data dentro da tolerância
        const dateDiff = Math.abs(bankTx.date.getTime() - sysTx.date.getTime())
        const daysDiff = dateDiff / (1000 * 60 * 60 * 24)
        if (daysDiff > this.config.dateToleranceDays) return false

        // Documento se disponível
        if (bankTx.document && sysTx.document) {
          return bankTx.document === sysTx.document
        }

        return true
      }) || null
    )
  }

  /**
   * Encontra matches fuzzy com score de confiança
   */
  private findFuzzyMatches(
    bankTx: Transaction,
    systemTransactions: Transaction[],
  ): Array<{ transaction: Transaction; confidence: number }> {
    const matches: Array<{ transaction: Transaction; confidence: number }> = []

    for (const sysTx of systemTransactions) {
      const confidence = this.calculateMatchConfidence(bankTx, sysTx)

      if (confidence > 0.3) {
        matches.push({ transaction: sysTx, confidence })
      }
    }

    return matches.sort((a, b) => b.confidence - a.confidence)
  }

  /**
   * Calcula score de confiança entre duas transações
   */
  private calculateMatchConfidence(bankTx: Transaction, sysTx: Transaction): number {
    let score = 0
    let maxScore = 0

    // Score por valor (peso 40%)
    const amountDiff = Math.abs(bankTx.amount - sysTx.amount)
    const amountTolerance = Math.abs(bankTx.amount) * (this.config.amountTolerancePercent / 100)

    if (amountDiff <= amountTolerance) {
      score += 0.4 * (1 - amountDiff / amountTolerance)
    }
    maxScore += 0.4

    // Score por data (peso 30%)
    const dateDiff = Math.abs(bankTx.date.getTime() - sysTx.date.getTime())
    const daysDiff = dateDiff / (1000 * 60 * 60 * 24)

    if (daysDiff <= this.config.dateToleranceDays) {
      score += 0.3 * (1 - daysDiff / this.config.dateToleranceDays)
    }
    maxScore += 0.3

    // Score por similaridade de descrição (peso 30%)
    const descSimilarity = this.calculateStringSimilarity(bankTx.description, sysTx.description)

    if (descSimilarity >= this.config.descriptionSimilarityThreshold) {
      score += 0.3 * descSimilarity
    }
    maxScore += 0.3

    return maxScore > 0 ? score / maxScore : 0
  }

  /**
   * Calcula similaridade entre strings usando algoritmo de Levenshtein
   */
  private calculateStringSimilarity(str1: string, str2: string): number {
    const s1 = str1.toLowerCase().trim()
    const s2 = str2.toLowerCase().trim()

    if (s1 === s2) return 1.0

    const longer = s1.length > s2.length ? s1 : s2
    const shorter = s1.length > s2.length ? s2 : s1

    if (longer.length === 0) return 1.0

    const distance = this.levenshteinDistance(longer, shorter)
    return (longer.length - distance) / longer.length
  }

  /**
   * Calcula distância de Levenshtein entre duas strings
   */
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = []

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i]
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1]
        } else {
          matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
        }
      }
    }

    return matrix[str2.length][str1.length]
  }

  /**
   * Identifica critérios que levaram ao match
   */
  private getMatchCriteria(bankTx: Transaction, sysTx: Transaction): string[] {
    const criteria: string[] = []

    if (Math.abs(bankTx.amount - sysTx.amount) <= 0.01) {
      criteria.push("amount")
    }

    const dateDiff = Math.abs(bankTx.date.getTime() - sysTx.date.getTime())
    const daysDiff = dateDiff / (1000 * 60 * 60 * 24)
    if (daysDiff <= this.config.dateToleranceDays) {
      criteria.push("date")
    }

    if (bankTx.document && sysTx.document && bankTx.document === sysTx.document) {
      criteria.push("document")
    }

    const descSimilarity = this.calculateStringSimilarity(bankTx.description, sysTx.description)
    if (descSimilarity >= this.config.descriptionSimilarityThreshold) {
      criteria.push("description")
    }

    return criteria
  }

  /**
   * Processa arquivo CSV de extrato bancário
   */
  static parseBankStatement(csvContent: string): Transaction[] {
    const lines = csvContent.split("\n")
    const transactions: Transaction[] = []

    // Assumindo formato: Data,Descrição,Valor,Documento
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      const [dateStr, description, amountStr, document] = line.split(",")

      transactions.push({
        id: `BANK_${i}`,
        date: new Date(dateStr),
        description: description.replace(/"/g, ""),
        amount: Number.parseFloat(amountStr),
        document: document?.replace(/"/g, ""),
        source: "bank",
      })
    }

    return transactions
  }

  /**
   * Processa arquivo do sistema interno
   */
  static parseSystemData(csvContent: string): Transaction[] {
    const lines = csvContent.split("\n")
    const transactions: Transaction[] = []

    // Assumindo formato: ID,Data,Descrição,Valor,Categoria
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      const [id, dateStr, description, amountStr, category] = line.split(",")

      transactions.push({
        id: id.replace(/"/g, ""),
        date: new Date(dateStr),
        description: description.replace(/"/g, ""),
        amount: Number.parseFloat(amountStr),
        category: category?.replace(/"/g, ""),
        source: "system",
      })
    }

    return transactions
  }
}

// Configuração padrão
export const defaultConfig: ConciliationConfig = {
  dateToleranceDays: 3,
  amountTolerancePercent: 0.1,
  descriptionSimilarityThreshold: 0.7,
  enableFuzzyMatching: true,
  priorityFields: ["amount", "date", "document", "description"],
}
