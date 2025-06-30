"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Play, RotateCcw, Settings, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function ConciliationProcess() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [processStatus, setProcessStatus] = useState<"idle" | "running" | "completed">("idle")

  const startConciliation = () => {
    setIsProcessing(true)
    setProcessStatus("running")
    setProgress(0)

    // Simular processo de conciliação
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsProcessing(false)
          setProcessStatus("completed")
          return 100
        }
        return prev + 10
      })
    }, 500)
  }

  const resetProcess = () => {
    setProgress(0)
    setProcessStatus("idle")
    setIsProcessing(false)
  }

  return (
    <div className="space-y-6">
      {/* Controles do Processo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Controle de Conciliação
          </CardTitle>
          <CardDescription>
            Execute o processo automático de conciliação entre extratos bancários e sistema interno
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <Button onClick={startConciliation} disabled={isProcessing} className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              {isProcessing ? "Processando..." : "Iniciar Conciliação"}
            </Button>

            <Button
              variant="outline"
              onClick={resetProcess}
              disabled={isProcessing}
              className="flex items-center gap-2 bg-transparent"
            >
              <RotateCcw className="h-4 w-4" />
              Reiniciar
            </Button>

            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Settings className="h-4 w-4" />
              Configurações
            </Button>
          </div>

          {/* Barra de Progresso */}
          {processStatus !== "idle" && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progresso da Conciliação</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Configurações de Matching */}
      <Card>
        <CardHeader>
          <CardTitle>Configurações de Matching</CardTitle>
          <CardDescription>Configure os critérios para matching automático</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium">Critérios Primários</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Valor Exato</span>
                  <Badge variant="default">Ativo</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Data ±3 dias</span>
                  <Badge variant="default">Ativo</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Número do Documento</span>
                  <Badge variant="default">Ativo</Badge>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Critérios Secundários</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Similaridade de Descrição</span>
                  <Badge variant="secondary">80%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Tolerância de Valor</span>
                  <Badge variant="secondary">R$ 0,01</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Histórico de Padrões</span>
                  <Badge variant="outline">Ativo</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resultados do Processo */}
      {processStatus === "completed" && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription>
            <strong>Conciliação Concluída!</strong> Processadas 1.250 transações em 2 minutos.
          </AlertDescription>
        </Alert>
      )}

      {/* Resumo dos Resultados */}
      {processStatus === "completed" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-green-600">Matches Automáticos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">1,180</div>
              <p className="text-sm text-gray-600">94.4% das transações</p>
              <div className="mt-3 space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Valor exato + Data</span>
                  <span>850</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Documento + Valor</span>
                  <span>230</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Padrão histórico</span>
                  <span>100</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-yellow-600">Possíveis Matches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">55</div>
              <p className="text-sm text-gray-600">4.4% requer revisão</p>
              <div className="mt-3 space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Diferença de valor</span>
                  <span>25</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Diferença de data</span>
                  <span>20</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Descrição similar</span>
                  <span>10</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-red-600">Sem Match</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">15</div>
              <p className="text-sm text-gray-600">1.2% sem correspondência</p>
              <div className="mt-3 space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Apenas no banco</span>
                  <span>8</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Apenas no sistema</span>
                  <span>7</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Log do Processo */}
      {processStatus !== "idle" && (
        <Card>
          <CardHeader>
            <CardTitle>Log do Processo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 font-mono text-sm bg-gray-50 p-4 rounded-lg max-h-60 overflow-y-auto">
              <div className="text-blue-600">[12:30:15] Iniciando processo de conciliação...</div>
              <div className="text-green-600">[12:30:16] Carregando extrato bancário: 1.250 registros</div>
              <div className="text-green-600">[12:30:17] Carregando sistema interno: 1.235 registros</div>
              <div className="text-blue-600">[12:30:18] Aplicando critérios de matching...</div>
              <div className="text-green-600">[12:30:25] Matches por valor exato: 850 encontrados</div>
              <div className="text-green-600">[12:30:30] Matches por documento: 230 encontrados</div>
              <div className="text-yellow-600">[12:30:35] Possíveis matches: 55 identificados</div>
              <div className="text-red-600">[12:30:40] Transações sem match: 15 identificadas</div>
              <div className="text-blue-600">[12:30:45] Processo concluído com sucesso!</div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
