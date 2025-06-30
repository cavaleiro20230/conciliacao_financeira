"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Link, X, Check, AlertTriangle } from "lucide-react"

interface Transaction {
  id: string
  date: string
  description: string
  amount: number
  source: "bank" | "system"
  status: "matched" | "unmatched" | "pending"
  possibleMatches?: string[]
}

export function ManualMatching() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null)

  const unmatchedTransactions: Transaction[] = [
    {
      id: "B001",
      date: "2024-12-28",
      description: "TED RECEBIDA EMPRESA XYZ LTDA",
      amount: 15000.0,
      source: "bank",
      status: "unmatched",
      possibleMatches: ["S001", "S002"],
    },
    {
      id: "S001",
      date: "2024-12-28",
      description: "PAGAMENTO FORNECEDOR XYZ",
      amount: 15000.0,
      source: "system",
      status: "unmatched",
    },
    {
      id: "B002",
      date: "2024-12-27",
      description: "PIX ENVIADO JOAO SILVA",
      amount: -2500.5,
      source: "bank",
      status: "unmatched",
    },
    {
      id: "S002",
      date: "2024-12-27",
      description: "PAGAMENTO SALARIO JOAO",
      amount: -2500.0,
      source: "system",
      status: "unmatched",
    },
  ]

  const possibleMatches: Transaction[] = [
    {
      id: "B003",
      date: "2024-12-26",
      description: "CARTAO CREDITO LOJA ABC",
      amount: -850.75,
      source: "bank",
      status: "pending",
      possibleMatches: ["S003"],
    },
    {
      id: "S003",
      date: "2024-12-25",
      description: "COMPRA MATERIAL ESCRITORIO",
      amount: -850.0,
      source: "system",
      status: "pending",
    },
  ]

  const handleMatch = (id1: string, id2: string) => {
    console.log(`Matching ${id1} with ${id2}`)
    // Implementar lógica de matching manual
  }

  const handleReject = (id: string) => {
    console.log(`Rejecting match for ${id}`)
    // Implementar lógica de rejeição
  }

  return (
    <div className="space-y-6">
      {/* Filtros e Busca */}
      <Card>
        <CardHeader>
          <CardTitle>Matching Manual</CardTitle>
          <CardDescription>Revise e confirme matches sugeridos ou crie matches manuais</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por descrição, valor ou data..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline">Filtros Avançados</Button>
          </div>
        </CardContent>
      </Card>

      {/* Matches Sugeridos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            Matches Sugeridos para Revisão
          </CardTitle>
          <CardDescription>Transações com possível correspondência que requerem confirmação manual</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {possibleMatches.map((transaction, index) => (
              <div key={transaction.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant={transaction.source === "bank" ? "default" : "secondary"}>
                    {transaction.source === "bank" ? "Banco" : "Sistema"}
                  </Badge>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleMatch(transaction.id, "S003")}>
                      <Check className="h-4 w-4 mr-1" />
                      Confirmar Match
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleReject(transaction.id)}>
                      <X className="h-4 w-4 mr-1" />
                      Rejeitar
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Transação Original</h4>
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-gray-600">Data: {transaction.date}</p>
                      <p className="text-sm font-medium">
                        Valor: R$ {Math.abs(transaction.amount).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Possível Match</h4>
                    <div className="bg-blue-50 p-3 rounded">
                      <p className="font-medium">COMPRA MATERIAL ESCRITORIO</p>
                      <p className="text-sm text-gray-600">Data: 2024-12-25</p>
                      <p className="text-sm font-medium">Valor: R$ 850,00</p>
                      <p className="text-xs text-red-600 mt-1">Diferença: R$ 0,75</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Transações Não Conciliadas */}
      <Card>
        <CardHeader>
          <CardTitle>Transações Não Conciliadas</CardTitle>
          <CardDescription>Transações que não encontraram correspondência automática</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Fonte</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {unmatchedTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">{transaction.id}</TableCell>
                  <TableCell>
                    <Badge variant={transaction.source === "bank" ? "default" : "secondary"}>
                      {transaction.source === "bank" ? "Banco" : "Sistema"}
                    </Badge>
                  </TableCell>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell className="max-w-xs truncate">{transaction.description}</TableCell>
                  <TableCell className={transaction.amount < 0 ? "text-red-600" : "text-green-600"}>
                    R$ {Math.abs(transaction.amount).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Link className="h-4 w-4 mr-1" />
                        Match Manual
                      </Button>
                      {transaction.possibleMatches && (
                        <Badge variant="outline" className="text-xs">
                          {transaction.possibleMatches.length} sugestões
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
