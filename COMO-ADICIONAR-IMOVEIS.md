# 🏠 Como Adicionar Imóveis ao Site Top Imobiliária

## 📋 Método Simples (JSON)

**TUDO QUE VOCÊ PRECISA FAZER: Editar um arquivo!**

---

## ✅ Passo a Passo

### 1. Acesse o arquivo
Abra: `imoveis.json` no GitHub ou localmente

### 2. Adicione um novo imóvel
Copie o modelo abaixo e preencha com os dados:

```json
{
  "id": 2,
  "titulo": "Seu Título Atraente",
  "tipo": "apartamento",
  "acao": "aluguel",
  "regiao": "areal",
  "regiao_nome": "Areal",
  "bairro": "Águas Claras",
  "quartos": 2,
  "suites": 1,
  "area": 75,
  "vagas": 1,
  "valor_venda": 450000,
  "valor_aluguel_bruto": 2100,
  "valor_aluguel_desconto": 0,
  "valor_aluguel_liquido": 2100,
  "condominio": 650,
  "agua_rateada": false,
  "descricao": "Descrição completa do imóvel...",
  "complemento": "Informações adicionais...",
  "endereco": "Endereço completo",
  "destaque": true,
  "status": "ativo"
}
```

### 3. Salve e faça commit
- Clique "Commit changes"
- Adicione mensagem: "Adicionar imóvel: [titulo]"
- Confirme

### 4. Pronto! ✨
O imóvel aparecerá automaticamente no site!

---

## 📝 Campos Explicados

| Campo | O que é | Exemplo |
|-------|---------|---------|
| `id` | Número único (aumente cada imóvel) | 1, 2, 3... |
| `titulo` | Nome do imóvel | "Apartamento em Águas Claras" |
| `tipo` | Tipo de propriedade | "apartamento", "casa", "cobertura" |
| `acao` | O que está fazendo | "aluguel" ou "venda" |
| `regiao` | Código da região (veja lista abaixo) | "areal", "ade" |
| `regiao_nome` | Nome completo da região | "Areal" |
| `quartos` | Número de quartos | 1, 2, 3... |
| `area` | Área em m² | 75, 100... |
| `vagas` | Vagas de garagem | 1, 2... |
| `valor_venda` | Preço de venda (se vender) | 450000 |
| `valor_aluguel_bruto` | Aluguel bruto (se alugar) | 2100 |
| `valor_aluguel_liquido` | Aluguel com descontos | 2100 |
| `condominio` | Taxa de condomínio | 650 |
| `agua_rateada` | Água rateada? | true/false |
| `descricao` | Descrição completa | Texto longo |
| `destaque` | Aparecer em destaque? | true/false |
| `status` | Status do imóvel | "ativo", "pendente", "alugado" |

---

## 📍 Regiões Disponíveis

**Águas Claras:**
- `areal` = Areal
- `arniqueiras` = Arniqueiras
- `ade` = ADE

**Outras regiões:**
- `asa-sul`, `asa-norte` = Asa Sul/Norte
- `lago-sul`, `lago-norte` = Lago Sul/Norte
- `park-way` = Park Way
- `taguatinga` = Taguatinga
- `guara` = Guará
- `ceilandia` = Ceilândia
- E muitas mais...

---

## 💡 Dicas

### Para alugar:
```json
{
  "acao": "aluguel",
  "valor_aluguel_bruto": 2100,
  "condominio": 650,
  "valor_venda": null
}
```

### Para vender:
```json
{
  "acao": "venda",
  "valor_venda": 450000,
  "valor_aluguel_bruto": null,
  "condominio": 0
}
```

### Marcar como destaque:
```json
{
  "destaque": true
}
```

### Desativar imóvel:
```json
{
  "status": "pendente"
}
```

---

## 🚀 Exemplo Completo

```json
{
  "id": 2,
  "titulo": "Apartamento 2 Quartos em Águas Claras",
  "tipo": "apartamento",
  "acao": "aluguel",
  "regiao": "areal",
  "regiao_nome": "Areal",
  "bairro": "Águas Claras",
  "quartos": 2,
  "suites": 1,
  "area": 75,
  "vagas": 1,
  "valor_venda": null,
  "valor_aluguel_bruto": 2500,
  "valor_aluguel_desconto": 0,
  "valor_aluguel_liquido": 2500,
  "condominio": 700,
  "agua_rateada": true,
  "descricao": "Apartamento moderno com 2 quartos e suíte. Cozinha planejada, sala ampla. Próximo ao metrô.",
  "complemento": "Água rateada. Condomínio R$ 700,00.",
  "endereco": "Rua 22, Areal, Águas Claras",
  "destaque": true,
  "status": "ativo"
}
```

---

## 📞 Precisa de Ajuda?

**Fale com a Top Imobiliária:**
- 📞 (61) 3042-4344
- 📱 (61) 98281-3233
- ✉️ redetopdf@gmail.com

---

**Pronto para adicionar seu primeiro imóvel? É só editar o JSON! 🎉**
