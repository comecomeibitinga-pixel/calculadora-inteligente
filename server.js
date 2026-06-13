const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Servir arquivos estáticos do diretório atual
app.use(express.static(__dirname));

// Rota coringa para direcionar ao index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🚀 Calculadora Inteligente - Ecom Expert Rodando!`);
  console.log(`   Acesse localmente em: http://localhost:${PORT}`);
  console.log(`==================================================`);
});
