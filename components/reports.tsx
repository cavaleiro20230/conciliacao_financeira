"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, FileText, TrendingUp, AlertTriangle, Calendar } from "lucide-react"

export function Reports() {
  const discrepancies = [
    {
      id: "DISC001",
      type: "Diferença de Valor",
      bankAmount: 1500.0,
      systemAmount: 1500.5,
      difference: -0.5,
      date: "2024-12-28",
      description: "PAGAMENTO FORNECEDOR ABC",
      status: "pending",
    },
    {
      id: "DISC002",
      type: "Diferença de Data",
      bankAmount: 2300.0,
      systemAmount: 2300.0,
      difference: 0,
      date: "2024-12-27",
      description: "TRANSFERENCIA ENTRE CONTAS",
      status: "resolved",
    },
    {
      id: "DISC003",
      type: "Transação Duplicada",
      bankAmount: 850.75,
      systemAmount: 850.75,
      difference: 0,
      date: "2024-12-26",
      description: "COMPRA CARTAO CREDITO",
      status: "pending",
    },
  ]

  const monthlyStats = [
    { month: "Dezembro 2024", total: 1250, matched: 1180, unmatched: 70, accuracy: 94.4 },
    { month: "Novembro 2024", total: 1180, matched: 1120, unmatched: 60, accuracy: 94.9 },
    { month: "Outubro 2024", total: 1320, matched: 1250, unmatched: 70, accuracy: 94.7 },
  ]

  return (
    <div className="space-y-6">
      {/* Resumo Executivo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Taxa de Conciliação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">94.4%</div>
            <p className="text-xs text-muted-foreground">+0.2% vs mês anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Discrepâncias Ativas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">15</div>
            <p className="text-xs text-muted-foreground">-3 vs mês anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Valor Total Conciliado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 2.8M</div>
            <p className="text-xs text-muted-foreground">Este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.3min</div>
            <p className="text-xs text-muted-foreground">Por processo</p>
          </CardContent>
        </Card>
      </div>

      {/* Relatórios Disponíveis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Relatórios Disponíveis
          </CardTitle>
          <CardDescription>Gere e baixe relatórios detalhados de conciliação</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: "Relatório de Conciliação Completo",
                description: "Todas as transações processadas no período",
                icon: FileText,
                format: "PDF/Excel",
              },
              {
                title: "Discrepâncias Detalhadas",
                description: "Lista completa de diferenças encontradas",
                icon: AlertTriangle,
                format: "PDF/Excel",
              },
              {
                title: "Análise de Performance",
                description: "Métricas e indicadores de eficiência",
                icon: TrendingUp,
                format: "PDF",
              },
              {
                title: "Transações Não Conciliadas",
                description: "Itens que requerem atenção manual",
                icon: AlertTriangle,
                format: "Excel",
              },
              {
                title: "Histórico Mensal",
                description: "Comparativo de performance por mês",
                icon: Calendar,
                format: "PDF/Excel",
              },
              {
                title: "Auditoria de Matches",
                description: "Log detalhado de todas as conciliações",
                icon: FileText,
                format: "Excel",
              },
            ].map((report, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <report.icon className="h-4 w-4" />
                    {report.title}
                  </CardTitle>
                  <CardDescription className="text-sm">{report.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{report.format}</Badge>
                    <Button size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Baixar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Discrepâncias Detalhadas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            Discrepâncias Identificadas
          </CardTitle>
          <CardDescription>Lista detalhada de diferenças que requerem análise</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Valor Banco</TableHead>
                <TableHead>Valor Sistema</TableHead>
                <TableHead>Diferença</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {discrepancies.map((disc) => (
                <TableRow key={disc.id}>
                  <TableCell className="font-medium">{disc.id}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{disc.type}</Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{disc.description}</TableCell>
                  <TableCell>R$ {disc.bankAmount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</TableCell>
                  <TableCell>R$ {disc.systemAmount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</TableCell>
                  <TableCell className={disc.difference !== 0 ? "text-red-600 font-medium" : "text-green-600"}>
                    {disc.difference !== 0
                      ? `R$ ${Math.abs(disc.difference).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
                      : "Sem diferença"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={disc.status === "resolved" ? "default" : "destructive"}>
                      {disc.status === "resolved" ? "Resolvido" : "Pendente"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline">
                      Analisar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Histórico Mensal */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Mensal</CardTitle>
          <CardDescription>Histórico de conciliações dos últimos meses</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Período</TableHead>
                <TableHead>Total de Transações</TableHead>
                <TableHead>Conciliadas</TableHead>
                <TableHead>Não Conciliadas</TableHead>
                <TableHead>Taxa de Sucesso</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {monthlyStats.map((stat, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{stat.month}</TableCell>
                  <TableCell>{stat.total.toLocaleString()}</TableCell>
                  <TableCell className="text-green-600">{stat.matched.toLocaleString()}</TableCell>
                  <TableCell className="text-red-600">{stat.unmatched.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{stat.accuracy}%</span>
                      <Badge variant={stat.accuracy > 94 ? "default" : "secondary"}>
                        {stat.accuracy > 94 ? "Excelente" : "Bom"}
                      </Badge>
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
