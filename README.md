# Calculadora Inteligente - Ecom Expert Edition 🚀

Uma ferramenta full-stack de alta performance e alta fidelidade visual desenvolvida para precificação estratégica e simulação de margens de lucro de lojistas e restaurantes em aplicativos de delivery (como iFood e Come Come Delivery).

O sistema resolve o problema clássico de custos invisíveis e taxas em cascata (fees inside fees), permitindo ao lojista precificar seus itens com base científica para obter lucro garantido.

---

## 💎 Funcionalidades Principais

1. **Modo Reverso (Engenharia Reversa de Lucro):**
   O lojista insere o lucro líquido que deseja colocar "no bolso" por pedido. O algoritmo calcula de forma exata o preço de vitrine necessário para cobrir todos os custos fixos, comissões de delivery, taxas financeiras e cupons.

2. **Análise Direta:**
   O lojista insere o preço atual que está cobrando na vitrine e o sistema destrincha todas as deduções da cascata, revelando a Margem de Contribuição (%) e o Lucro Líquido (R$) reais.

3. **Motor de Preço Psicológico:**
   Algoritmo que arredonda o preço de vitrine sugerido para cima, terminando em padrões atraentes ao cérebro humano (como `.90`, `.99`, `.95`, `.89`), aumentando a taxa de conversão e protegendo o caixa contra dízimos de centavos.

4. **Motor de Heurísticas Ecom Expert (100% Local e Offline):**
   Com base nos custos inseridos, margem de contribuição resultante e meios de pagamento selecionados, o painel do consultor exibe dicas de negócios e alertas financeiros dinâmicos e imediatos.

5. **Preview de Cardápio Realista:**
   Simulador de smartphone interativo que renderiza o produto com o preço calculado e preço âncora ("DE / POR"), permitindo a edição direta dos textos (Nome e Descrição) no próprio celular para testes de visualização.

---

## 🧮 Fórmulas Matemáticas Aplicadas

Para calcular o **Preço de Vitrine ($P_v$)** no **Modo Reverso**, consideramos que o lucro líquido real ($P_n$) deve ser igual ao lucro desejado ($P_d$).

Sejam:
- $P_d$: Lucro Desejado
- $C$: Custo de Insumo (CMV)
- $F$: Custo Fixo Operacional (Embalagem, lacres, taxa de transação fixa)
- $r_{plat}$: Taxa de Comissão da Plataforma (ex: 23% = 0.23)
- $r_{cash}$: Taxa de Cashback/Cupons co-participados (ex: 5% = 0.05)
- $r_{pay}$: Taxa Financeira de Pagamento Online (ex: PIX 1.5% = 0.015)

O preço de vitrine necessário é dado por:

$$P_v = \frac{P_d + C + F}{1 - (r_{plat} + r_{cash} + r_{pay})}$$

> **Nota de Segurança:** Caso a soma das taxas ultrapasse 95% do valor do produto, o sistema trava o divisor em 0.05 para evitar divisão por zero ou preços infinitos negativos, alertando o usuário.

---

## ⚙️ Como Executar a Aplicação

A aplicação foi projetada para ser extremamente versátil. Você pode rodá-la de duas formas:

### Método 1: Abertura Direta (Sem dependências)
Basta dar um duplo clique no arquivo `index.html` em qualquer computador. A aplicação funciona 100% no navegador (offline) utilizando os fallbacks de imagens integrados.

### Método 2: Servidor Local (Node.js & Express)
Se você deseja executar o projeto em uma estrutura de servidor web:
1. Abra o terminal na pasta do projeto.
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor:
   ```bash
   npm start
   ```
4. Acesse no navegador: [http://localhost:3000](http://localhost:3000)
