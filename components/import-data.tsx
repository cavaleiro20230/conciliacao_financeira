"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function ImportData() {
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setUploadStatus("idle")
    }
  }

  const processFile = async () => {
    if (!selectedFile) return

    setUploadStatus("uploading")

    // Simular processamento
    setTimeout(() => {
      setUploadStatus("success")
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload de Extrato Bancário */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Extrato Bancário
            </CardTitle>
            <CardDescription>Importe seu extrato bancário em formato CSV, Excel ou OFX</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bank-file">Arquivo do Banco</Label>
              <Input id="bank-file" type="file" accept=".csv,.xlsx,.ofx" onChange={handleFileUpload} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bank-select">Banco</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o banco" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bb">Banco do Brasil</SelectItem>
                  <SelectItem value="itau">Itaú</SelectItem>
                  <SelectItem value="bradesco">Bradesco</SelectItem>
                  <SelectItem value="santander">Santander</SelectItem>
                  <SelectItem value="caixa">Caixa Econômica</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={processFile} disabled={!selectedFile || uploadStatus === "uploading"} className="w-full">
              {uploadStatus === "uploading" ? "Processando..." : "Importar Extrato"}
            </Button>
          </CardContent>
        </Card>

        {/* Upload de Sistema Interno */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Sistema Interno
            </CardTitle>
            <CardDescription>Importe dados do seu sistema de gestão financeira</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="system-file">Arquivo do Sistema</Label>
              <Input id="system-file" type="file" accept=".csv,.xlsx,.json" onChange={handleFileUpload} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="system-select">Tipo de Sistema</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o sistema" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="erp">ERP Interno</SelectItem>
                  <SelectItem value="crm">CRM</SelectItem>
                  <SelectItem value="contabil">Sistema Contábil</SelectItem>
                  <SelectItem value="custom">Sistema Customizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full">Importar Sistema</Button>
          </CardContent>
        </Card>
      </div>

      {/* Status do Upload */}
      {uploadStatus !== "idle" && (
        <Alert
          className={
            uploadStatus === "success"
              ? "border-green-200 bg-green-50"
              : uploadStatus === "error"
                ? "border-red-200 bg-red-50"
                : "border-blue-200 bg-blue-50"
          }
        >
          {uploadStatus === "success" ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : uploadStatus === "error" ? (
            <AlertCircle className="h-4 w-4 text-red-600" />
          ) : (
            <Upload className="h-4 w-4 text-blue-600" />
          )}
          <AlertDescription>
            {uploadStatus === "uploading" && "Processando arquivo..."}
            {uploadStatus === "success" &&
              `Arquivo "${selectedFile?.name}" importado com sucesso! 1.250 transações processadas.`}
            {uploadStatus === "error" && "Erro ao processar arquivo. Verifique o formato e tente novamente."}
          </AlertDescription>
        </Alert>
      )}

      {/* Histórico de Importações */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Importações</CardTitle>
          <CardDescription>Últimas importações realizadas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { file: "extrato_bb_dezembro.csv", date: "2024-12-30", records: 450, status: "success" },
              { file: "sistema_interno_dezembro.xlsx", date: "2024-12-30", records: 800, status: "success" },
              { file: "extrato_itau_novembro.ofx", date: "2024-11-30", records: 320, status: "success" },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-medium">{item.file}</p>
                    <p className="text-sm text-gray-500">
                      {item.records} registros • {item.date}
                    </p>
                  </div>
                </div>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
