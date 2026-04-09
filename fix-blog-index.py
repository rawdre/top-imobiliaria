# Read blog-index.html
with open('blog-index.html', 'r', encoding='utf-8') as f:
    content = f.read()

print("🔧 Fixing blog-index.html regions...")

# 1. Fix Águas Claras
content = content.replace(
    '''<optgroup label="Distrito Federal">
<option value="ac-norte">Águas Claras Norte</option>
<option value="ac-sul">Águas Claras Sul</option>
<option value="ao-norte">Área Oficial Norte</option>
<option value="ao-sul">Área Oficial Sul</option>''',
    '''<optgroup label="Águas Claras">
<option value="todos">Todos</option>
<option value="areal">Areal</option>
<option value="arniqueiras">Arniqueiras</option>
<option value="ade">ADE</option>'''
)

# 2. Remove incorrect regions
content = content.replace('<option value="rio-preto">Rio Preto</option>', '')
content = content.replace('<option value="rio-rondon">Rio Rondon</option>', '')
content = content.replace('<option value="sao-marcos">São Marcos</option>', '')
content = content.replace('<option value="reserva">Reserva</option>', '')

# 3. Fix GO regions
content = content.replace(
    '''<optgroup label="Goiás (Entorno)">
<option value="agua-linda">Águas Lindas de Goiás</option>
<option value="aba-de-goias">Abadia de Goiás</option>
<option value="anapolis">Anápolis</option>
<option value="cachoeira">Cachoeira de Goiás</option>
<option value="caldas">Caldas Novas</option>
<option value="catalao">Catalão</option>
<option value="corumba">Corumbá de Goiás</option>
<option value="formosa">Formosa</option>
<option value="goianesia">Goianésia</option>
<option value="goias">Goiânia</option>
<option value="indai">Indaiá</option>
<option value="itelandia">Itolândia</option>
<option value="trindade">Trindade</option>
</optgroup>''',
    '''<optgroup label="Goiás (Entorno)">
<option value="valparaiso">Valparaíso de Goiás</option>
<option value="cidade-ocidental">Cidade Ocidental</option>
<option value="novo-gama">Novo Gama</option>
<option value="luziania">Luziânia</option>
<option value="aguas-lindas">Águas Lindas de Goiás</option>
<option value="planaltina">Planaltina de Goiás</option>
<option value="jardim-inga">Jardim Ingá</option>
<option value="santa-maria">Santa Maria</option>
</optgroup>'''
)

# 4. Add 0 quartos option
content = content.replace(
    '''<select id="simQuartos">
<option value="1">1 Quarto</option>
<option value="2" selected>2 Quartos</option>
<option value="3">3 Quartos</option>
<option value="4">4+ Quartos</option>
</select>''',
    '''<select id="simQuartos">
<option value="0">0 Quartos</option>
<option value="1">1 Quarto</option>
<option value="2" selected>2 Quartos</option>
<option value="3">3 Quartos</option>
<option value="4">4+ Quartos</option>
</select>'''
)

# Save
with open('blog-index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ blog-index.html updated!")
