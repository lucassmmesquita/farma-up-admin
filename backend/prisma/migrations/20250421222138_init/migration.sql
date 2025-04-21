-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "perfil" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Farmacia" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "endereco" TEXT,
    "telefone" TEXT,
    "email" TEXT,
    "corPrincipal" TEXT NOT NULL DEFAULT '#2E7D32',
    "corSecundaria" TEXT NOT NULL DEFAULT '#FF5722',
    "logo" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Farmacia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FarmaciaUsuario" (
    "id" TEXT NOT NULL,
    "farmaciaId" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FarmaciaUsuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Indicador" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "unidade" TEXT NOT NULL,
    "metaPadrao" TEXT NOT NULL,
    "temImpacto" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Indicador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IndicadorRelacionado" (
    "id" TEXT NOT NULL,
    "indicadorOrigemId" TEXT NOT NULL,
    "indicadorDestinoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IndicadorRelacionado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanoAcao" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "farmaciaId" TEXT NOT NULL,
    "indicadorId" TEXT NOT NULL,
    "responsavelId" TEXT NOT NULL,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "prazo" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'EM_ANDAMENTO',
    "percentualConcluido" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlanoAcao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Acao" (
    "id" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "prazo" TIMESTAMP(3) NOT NULL,
    "concluida" BOOLEAN NOT NULL DEFAULT false,
    "atrasada" BOOLEAN NOT NULL DEFAULT false,
    "planoAcaoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Acao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comentario" (
    "id" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "planoAcaoId" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comentario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evidencia" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "descricao" TEXT,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'PENDENTE',
    "dataValidacao" TIMESTAMP(3),
    "validadoPorId" TEXT,
    "motivoReprovacao" TEXT,
    "planoId" TEXT NOT NULL,
    "farmaciaId" TEXT NOT NULL,
    "indicadorId" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Evidencia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComentarioEvidencia" (
    "id" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "evidenciaId" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ComentarioEvidencia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Medicamento" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "ultimaCompra" TIMESTAMP(3) NOT NULL,
    "proximaCompra" TIMESTAMP(3) NOT NULL,
    "duracaoDias" INTEGER NOT NULL,
    "lembreteEnviado" BOOLEAN NOT NULL DEFAULT false,
    "farmaciaId" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Medicamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Farmacia_cnpj_key" ON "Farmacia"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "FarmaciaUsuario_farmaciaId_usuarioId_key" ON "FarmaciaUsuario"("farmaciaId", "usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "Indicador_codigo_key" ON "Indicador"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "IndicadorRelacionado_indicadorOrigemId_indicadorDestinoId_key" ON "IndicadorRelacionado"("indicadorOrigemId", "indicadorDestinoId");

-- AddForeignKey
ALTER TABLE "FarmaciaUsuario" ADD CONSTRAINT "FarmaciaUsuario_farmaciaId_fkey" FOREIGN KEY ("farmaciaId") REFERENCES "Farmacia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FarmaciaUsuario" ADD CONSTRAINT "FarmaciaUsuario_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IndicadorRelacionado" ADD CONSTRAINT "IndicadorRelacionado_indicadorOrigemId_fkey" FOREIGN KEY ("indicadorOrigemId") REFERENCES "Indicador"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IndicadorRelacionado" ADD CONSTRAINT "IndicadorRelacionado_indicadorDestinoId_fkey" FOREIGN KEY ("indicadorDestinoId") REFERENCES "Indicador"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanoAcao" ADD CONSTRAINT "PlanoAcao_farmaciaId_fkey" FOREIGN KEY ("farmaciaId") REFERENCES "Farmacia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanoAcao" ADD CONSTRAINT "PlanoAcao_indicadorId_fkey" FOREIGN KEY ("indicadorId") REFERENCES "Indicador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanoAcao" ADD CONSTRAINT "PlanoAcao_responsavelId_fkey" FOREIGN KEY ("responsavelId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Acao" ADD CONSTRAINT "Acao_planoAcaoId_fkey" FOREIGN KEY ("planoAcaoId") REFERENCES "PlanoAcao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comentario" ADD CONSTRAINT "Comentario_planoAcaoId_fkey" FOREIGN KEY ("planoAcaoId") REFERENCES "PlanoAcao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comentario" ADD CONSTRAINT "Comentario_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evidencia" ADD CONSTRAINT "Evidencia_planoId_fkey" FOREIGN KEY ("planoId") REFERENCES "PlanoAcao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evidencia" ADD CONSTRAINT "Evidencia_farmaciaId_fkey" FOREIGN KEY ("farmaciaId") REFERENCES "Farmacia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evidencia" ADD CONSTRAINT "Evidencia_indicadorId_fkey" FOREIGN KEY ("indicadorId") REFERENCES "Indicador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evidencia" ADD CONSTRAINT "Evidencia_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComentarioEvidencia" ADD CONSTRAINT "ComentarioEvidencia_evidenciaId_fkey" FOREIGN KEY ("evidenciaId") REFERENCES "Evidencia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComentarioEvidencia" ADD CONSTRAINT "ComentarioEvidencia_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Medicamento" ADD CONSTRAINT "Medicamento_farmaciaId_fkey" FOREIGN KEY ("farmaciaId") REFERENCES "Farmacia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Medicamento" ADD CONSTRAINT "Medicamento_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
