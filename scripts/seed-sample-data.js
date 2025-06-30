// Script para gerar dados de exemplo para teste do sistema

const fs = require("fs")
const path = require("path")

// Gerar dados de extrato bancário
function generateBankStatement() {
  const transactions = []
  const startDate = new Date("2024-12-01")

  for (let i = 0; i < 100; i++) {
    const date = new Date(startDate)
    date.setDate(date.getDate() + Math.floor(Math.random() * 30))

    const descriptions = [
      "TED RECEBIDA EMPRESA XYZ LTDA",
      "PIX ENVIADO JOAO SILVA",
      "CARTAO CREDITO LOJA ABC",
      "TRANSFERENCIA ENTRE CONTAS",
      "PAGAMENTO FORNECEDOR DEF",
      "DEPOSITO EM DINHEIRO",
      "SAQUE CAIXA ELETRONICO",
      "DEBITO AUTOMATICO ENERGIA",
      "PAGAMENTO BOLETO TELEFONE",
      "TRANSFERENCIA DOC MARIA",
    ]

    const amount = (Math.random() * 10000 - 5000).toFixed(2)
    const description = descriptions[Math.floor(Math.random() * descriptions.length)]
    const document = Math.random() > 0.5 ? `DOC${String(i).padStart(6, "0")}` : ""

    transactions.push([date.toISOString().split("T")[0], `"${description}"`, amount, `"${document}"`])
  }

  const header = "Data,Descrição,Valor,Documento"
  const csv = [header, ...transactions.map((t) => t.join(","))].join("\n")

  return csv
}

// Gerar dados do sistema interno
function generateSystemData() {
  const transactions = []
  const startDate = new Date("2024-12-01")

  for (let i = 0; i < 95; i++) {
    const date = new Date(startDate)
    date.setDate(date.getDate() + Math.floor(Math.random() * 30))

    const descriptions = [
      "PAGAMENTO FORNECEDOR XYZ",
      "SALARIO FUNCIONARIO JOAO",
      "COMPRA MATERIAL ESCRITORIO",
      "TRANSFERENCIA INTERNA",
      "PAGAMENTO FORNECEDOR DEF",
      "RECEITA VENDA PRODUTO",
      "SAQUE PARA CAIXA",
      "PAGAMENTO CONTA ENERGIA",
      "PAGAMENTO CONTA TELEFONE",
      "TRANSFERENCIA CLIENTE MARIA",
    ]

    const categories = ["RECEITA", "DESPESA", "TRANSFERENCIA", "INVESTIMENTO"]

    const amount = (Math.random() * 10000 - 5000).toFixed(2)
    const description = descriptions[Math.floor(Math.random() * descriptions.length)]
    const category = categories[Math.floor(Math.random() * categories.length)]

    transactions.push([
      `"SYS${String(i + 1).padStart(6, "0")}"`,
      date.toISOString().split("T")[0],
      `"${description}"`,
      amount,
      `"${category}"`,
    ])
  }

  const header = "ID,Data,Descrição,Valor,Categoria"
  const csv = [header, ...transactions.map((t) => t.join(","))].join("\n")

  return csv
}

// Gerar arquivos de exemplo
const bankData = generateBankStatement()
const systemData = generateSystemData()

console.log("=== EXTRATO BANCÁRIO (Primeiras 10 linhas) ===")
console.log(bankData.split("\n").slice(0, 11).join("\n"))

console.log("\n=== SISTEMA INTERNO (Primeiras 10 linhas) ===")
console.log(systemData.split("\n").slice(0, 11).join("\n"))

console.log("\n=== ESTATÍSTICAS ===")
console.log(`Transações bancárias: ${bankData.split("\n").length - 1}`)
console.log(`Transações do sistema: ${systemData.split("\n").length - 1}`)
console.log("Diferença intencional para simular discrepâncias")

// Salvar arquivos se executado diretamente
if (typeof window === "undefined") {
  try {
    fs.writeFileSync("extrato_bancario_exemplo.csv", bankData)
    fs.writeFileSync("sistema_interno_exemplo.csv", systemData)
    console.log("\nArquivos salvos: extrato_bancario_exemplo.csv e sistema_interno_exemplo.csv")
  } catch (error) {
    console.log("\nNão foi possível salvar os arquivos (normal no ambiente web)")
  }
}
