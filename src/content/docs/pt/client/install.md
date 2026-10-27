---
title: 'Instalação e primeira execução'
description: 'Abrir pela primeira vez (no macOS simplesmente abre; no Windows precisa de Executar assim mesmo), entrar com o Google, criar um personagem e começar a jogar.'
---

## Abrir pela primeira vez

### macOS — simplesmente abre

**A compilação de macOS é assinada com um Apple Developer ID, notarizada pela Apple e tem o ticket grampeado no app.** Descompacte, dê um duplo clique e roda sem aviso do Gatekeeper.

Você não precisa de clique direito → Abrir, nem de `xattr -cr` — o conselho que se acha na internet para apps sem assinatura não se aplica a esta compilação.

### Windows — um clique extra

**A compilação de Windows não é assinada**, então o SmartScreen mostra “O Windows protegeu o seu PC”. Clique em **Mais informações** → **Executar assim mesmo**.

Certificados de assinatura de código custam dinheiro todo ano e por ora existe apenas um, para macOS. Se o projeto é útil para você, [apoiá-lo](https://ko-fi.com/dakywang) ajuda a deixar um certificado de Windows ao alcance.

### Linux — marque o bit de execução

AppImages não têm assinatura de que se falar; só precisam ser executáveis:

```bash
chmod +x openmmo-agent-*linux-x64.AppImage
./openmmo-agent-*linux-x64.AppImage
```

## Primeira execução

Quatro telas em ordem e você está no jogo. **Não existe um passo “Jogar” separado** — escolher um personagem entra no jogo imediatamente.

### 1. Servidor — escolha um perfil de conexão

O perfil embutido `openmmo.to.nexus` é fixo, e é o que a maioria quer.

Um perfil amarra três coisas: a URL do servidor, a origem dos recursos de terreno e um ID/segredo de cliente do Google. Eles têm de viajar juntos, porque um servidor só aceita tokens emitidos por um ID de cliente da sua própria lista. Se você mantém seu próprio servidor, pode criar, editar, duplicar e apagar perfis, e testar a conexão antes de usar.

### 2. Login — fluxo de dispositivo do Google

Aperte o botão e aparece um código; digite-o no seu navegador. Uma credencial em cache pula direto para o passo seguinte.

### 3. Personagem — escolha ou crie

Duas abas:

- **Escolha seu personagem** — até 3 por conta (imposto pelo servidor). Clique para entrar no jogo, ou apague.
- **Criar um novo personagem** — nome, classe, gênero. Fica oculto quando você chega ao limite.

### 4. Jogo

O modo é decidido para você na entrada: **automático se houver um backend LLM configurado e ele passar na validação, manual caso contrário**. Se o automático não iniciar, cai para manual. Você pode trocar a qualquer momento no cabeçalho.

## Os dois modos de jogo

O servidor permite exatamente uma sessão de controle por personagem, então os dois modos chegam lá de formas diferentes.

**O jogo manual** é uma conexão direta — o cliente web do OpenMMO embutido entra com a sua própria conta Google e fala direto com o servidor, igualzinho a jogar no navegador. Sem relé, sem `agent-client`.

**O jogo automático** inicia o `agent-client`, que precisa daquela única sessão para si — então assistir não pode significar entrar ao lado dele. Em vez disso, um relé fica no loopback:

```
agent-client <--ws--> proxy (127.0.0.1) <--wss--> openmmo.to.nexus
                        |
                        +--> espectadores (/mirror)
```

O servidor não tem ideia de que há algo atrás do agente. Ficar no meio permite ao relé duplicar cada mensagem do servidor para uma visão de espectador somente leitura. **O relé escuta apenas em `127.0.0.1`, então nada sai da sua máquina.**

## A tela de jogo

O cabeçalho mostra o estado da conexão, os sinais vitais, o uso de memória do espectador, um botão para recarregar a visão 3D, a chave manual/IA e botões para trocar de personagem ou de servidor. Mude uma configuração com o agente rodando e aparece um botão **Aplicar e reiniciar**.

A barra da esquerda abre seis gavetas:

| Gaveta | O que mostra |
|---|---|
| Equipamento | O que está vestido, espaço por espaço |
| Bolsa | O que está carregado, e quais itens o agente pode vender ou descartar |
| Personalidade e memória | O prompt próprio deste personagem (editável) e o que o agente anotou (somente leitura) |
| Coordenadas | Marcadores de lugares, incluindo “usar posição atual” |
| Instruções salvas | Ordens de uso frequente salvas como botões de um clique |
| Atividade | Duas abas: Pensamentos (cada prompt e resposta) e Log (a saída do processo do agente) |

Cada gaveta é detalhada na [referência do painel](../panel/).

**Despacho**, encaixado abaixo da visão de jogo, é o único controle que alcança um agente em execução: digite uma instrução e ela chega como o próximo turno do personagem, **na medida do possível — sem garantia de que será seguida.**

## Onde ficam suas chaves

Chaves de API e segredos dos perfis de conexão são cifrados com o chaveiro do sistema (o `safeStorage` do Electron, com AES-GCM como reserva) e entregues ao agente como variáveis de ambiente — **nunca escritos no `config.toml`.** Uma configuração colada num relatório de bug não leva credencial nenhuma.

## Resolução de problemas

**Versão de protocolo incompatível** — o servidor foi atualizado. Pegue uma compilação nova na [página de download](../download/).

**Mudei uma configuração e nada aconteceu** — o agente lê sua configuração uma única vez ao iniciar. Aperte **Aplicar e reiniciar** no cabeçalho.

**Iniciei por um terminal do VS Code e nunca abre** — o VS Code é ele mesmo um app Electron e deixa escapar `ELECTRON_RUN_AS_NODE=1`, iniciando o cliente como Node puro:

```bash
env -u ELECTRON_RUN_AS_NODE npm start
```

**Algo está faltando ou congelado na visão de espectador** — a visão de espectador do jogo automático parte de um instantâneo, então tudo que o agente conhece mas não está acompanhando agora aparece conforme volta ao campo de visão.
