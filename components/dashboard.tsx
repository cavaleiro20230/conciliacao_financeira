"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ImportData } from "./import-data"
import { ConciliationProcess } from "./conciliation-process"
import { Reports } from "./reports"
import { ManualMatching } from "./manual-matching"
import { FileText, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react"

export function Dashboard() {
  const [stats, setStats] = useState({
    totalTransactions: 1250,
    matchedTransactions: 1180,
    unmatchedTransactions: 70,
    discrepancies: 15,
  })

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sistema de Conciliação Financeira</h1>
            <p className="text-gray-600 mt-2">Gerencie e reconcilie suas transações financeiras</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Transações</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTransactions.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Processadas este mês</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conciliadas</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.matchedTransactions.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {((stats.matchedTransactions / stats.totalTransactions) * 100).toFixed(1)}% do total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Não Conciliadas</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.unmatchedTransactions.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Requerem atenção</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Discrepâncias</CardTitle>
              <TrendingUp className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.discrepancies.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Diferenças encontradas</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="import" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="import">Importar Dados</TabsTrigger>
            <TabsTrigger value="process">Processar Conciliação</TabsTrigger>
            <TabsTrigger value="manual">Matching Manual</TabsTrigger>
            <TabsTrigger value="reports">Relatórios</TabsTrigger>
          </TabsList>

          <TabsContent value="import">
            <ImportData />
          </TabsContent>

          <TabsContent value="process">
            <ConciliationProcess />
          </TabsContent>

          <TabsContent value="manual">
            <ManualMatching />
          </TabsContent>

          <TabsContent value="reports">
            <Reports />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
