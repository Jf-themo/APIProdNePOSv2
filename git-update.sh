#!/bin/bash
# ============================================
# 🧩 Script de actualización para forks de GitHub
# Mantiene tu fork sincronizado con el repo original
# Permite crear un commit editable al final
# ============================================

set -e  # Detiene el script si ocurre un error

echo "🚀 Iniciando proceso de actualización..."

# 1️⃣ Verificar que existan los remotos
echo "🔍 Verificando remotos configurados..."
git remote -v

if ! git remote | grep -q upstream; then
  echo "⚠️  No se detectó 'upstream'. Agrega el remoto del repo original antes de continuar:"
  echo "    git remote add upstream https://github.com/usuario_original/repositorio.git"
  exit 1
fi

# 2️⃣ Cambiar a la rama principal
echo "📂 Cambiando a la rama principal (main)..."
git checkout main

# 3️⃣ Traer cambios del repo original
echo "📡 Obteniendo actualizaciones desde 'upstream'..."
git fetch upstream

# 4️⃣ Rebase limpio con la rama principal
echo "🧠 Aplicando rebase de 'upstream/main'..."
git pull --rebase upstream main

# 5️⃣ Mostrar resumen de cambios
echo "📄 Resumen de los cambios incorporados:"
git log origin/main..main --oneline || echo "No hay cambios nuevos."

# 6️⃣ Preguntar si deseas crear un commit de sincronización
read -p "¿Deseas crear un commit de sincronización editable? (s/n): " opcion

if [[ "$opcion" == "s" || "$opcion" == "S" ]]; then
  echo "📝 Abriendo editor para escribir tu mensaje de commit..."
  git commit --allow-empty -e  # Crea commit vacío y abre el editor
  echo "✅ Commit creado con tu mensaje personalizado."
else
  echo "⏭️  No se creó commit adicional."
fi

# 7️⃣ Subir los cambios actualizados a tu fork
echo "☁️  Subiendo actualizaciones a tu fork..."
git push origin main --force-with-lease

# 8️⃣ Confirmar éxito
echo "✅ Tu fork está completamente sincronizado con el original."
git status
echo "-------------------------------------------"
