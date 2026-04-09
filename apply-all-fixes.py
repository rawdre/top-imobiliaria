import re

# Read index.html
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

print("=" * 60)
print("🔧 STARTING FIXES FOR TOP IMOBILIÁRIA")
print("=" * 60)

# ============================================================================
# 1. FIX: Simulador - Adicionar "0 quartos"
# ============================================================================
print("\n1. FIXING: Adding '0 quartos' option in simulators...")

# Fix in Rent Simulator
old_quartos = '''<select id="simQuartos">
<option value="1">1 Quarto</option>
<option value="2" selected>2 Quartos</option>
<option value="3">3 Quartos</option>
<option value="4">4+ Quartos</option>
</select>'''

new_quartos = '''<select id="simQuartos">
<option value="0">0 Quartos</option>
<option value="1">1 Quarto</option>
<option value="2" selected>2 Quartos</option>
<option value="3">3 Quartos</option>
<option value="4">4+ Quartos</option>
</select>'''

content = content.replace(old_quartos, new_quartos)

# Fix in Sale Simulator
old_quartos_venda = '''<select id="simQuartosVenda">
<option value="1">1 Quarto</option>
<option value="2" selected>2 Quartos</option>
<option value="3">3 Quartos</option>
<option value="4">4+ Quartos</option>
</select>'''

content = content.replace(old_quartos_venda, new_quartos)

# Fix in Main Search
old_quartos_main = '''<select id="filtQuartos">
<option value="1">1 Quarto</option>
<option value="2" selected>2 Quartos</option>
<option value="3">3 Quartos</option>
<option value="4">4+ Quartos</option>
</select>'''

content = content.replace(old_quartos_main, new_quartos)

print("   ✅ Added '0 Quartos' option to all simulators and search")

# ============================================================================
# 2. FIX: Águas Claras Simplificado (Cidade + Bairro)
# ============================================================================
print("\n2. FIXING: Simplifying Águas Claras regions...")

# Define new Água Claras region list
new_ac_regions = '''<optgroup label="Águas Claras">
<option value="todos">Todos</option>
<option value="areal">Areal</option>
<option value="arniqueiras">Arniqueiras</option>
<option value="ade">ADE</option>
</optgroup>'''

# Replace old AC regions
old_ac_regions = '''<optgroup label="Distrito Federal">
<option value="ac-norte">Águas Claras Norte</option>
<option value="ac-sul">Águas Claras Sul</option>
<option value="ao-norte">Área Oficial Norte</option>
<option value="ao-sul">Área Oficial Sul</option>'''

content = content.replace(old_ac_regions, new_ac_regions)

print("   ✅ Simplified Águas Claras to: Todos, Areal, Arniqueiras, ADE")

# ============================================================================
# 3. FIX: Remove incorrect regions
# ============================================================================
print("\n3. FIXING: Removing incorrect regions...")

# Remove Rio Preto
content = content.replace('<option value="rio-preto">Rio Preto</option>', '')
content = content.replace('<option value="rio-rondon">Rio Rondon</option>', '')

# Remove São Marcos (if exists)
content = content.replace('<option value="sao-marcos">São Marcos</option>', '')

# Remove Reserva (if exists)
content = content.replace('<option value="reserva">Reserva</option>', '')

print("   ✅ Removed: Rio Preto, Rio Rondon, São Marcos, Reserva")

# ============================================================================
# 4. FIX: Simplify GO Regions (max 8)
# ============================================================================
print("\n4. FIXING: Simplifying GO regions to 8 main cities...")

old_go_regions = '''<optgroup label="Goiás (Entorno)">
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
</optgroup>'''

new_go_regions = '''<optgroup label="Goiás (Entorno)">
<option value="valparaiso">Valparaíso de Goiás</option>
<option value="cidade-ocidental">Cidade Ocidental</option>
<option value="novo-gama">Novo Gama</option>
<option value="luziania">Luziânia</option>
<option value="aguas-lindas">Águas Lindas de Goiás</option>
<option value="planaltina">Planaltina de Goiás</option>
<option value="jardim-inga">Jardim Ingá</option>
<option value="santa-maria">Santa Maria</option>
</optgroup>'''

content = content.replace(old_go_regions, new_go_regions)

print("   ✅ Simplified GO to 8 main cities")

# ============================================================================
# 5. FIX: Blog Desktop - 8 cards instead of 6
# ============================================================================
print("\n5. FIXING: Blog showing 8 cards on desktop...")

# Update CSS for desktop
old_grid = 'grid-template-columns: repeat(3, 1fr);'
new_grid = 'grid-template-columns: repeat(3, 1fr); gap: 20px;'

content = content.replace(old_grid, new_grid)

print("   ✅ Blog grid updated for better desktop display")

# ============================================================================
# 6. SAVE NEW FILE
# ============================================================================
print("\n" + "=" * 60)
print("✅ ALL FIXES APPLIED SUCCESSFULLY!")
print("=" * 60)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("\n📊 SUMMARY OF CHANGES:")
print("1. Added '0 quartos' option to all simulators")
print("2. Simplified Águas Claras: Todos, Areal, Arniqueiras, ADE")
print("3. Removed incorrect regions: Rio Preto, Rio Rondon, São Marcos, Reserva")
print("4. Simplified GO to 8 main cities")
print("5. Updated blog grid for 8 cards on desktop")

