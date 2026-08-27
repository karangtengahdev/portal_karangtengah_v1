{
  echo "=== STRUKTUR FOLDER ==="
  find . \( -name node_modules -o -name .git -o -name dist -o -name build -o -name .next -o -name coverage \) -prune -o -type f -print | sed 's|^\./||' | sort

  echo ""
  echo "=== ISI FILE ==="
  find . -type f \
    \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.prisma" -o -name "*.json" -o -name "*.md" -o -name "*.env.example" \) \
    -not -name "package-lock.json" -not -name "yarn.lock" -not -name "pnpm-lock.yaml" \
    -not -path "*/node_modules/*" -not -path "*/.git/*" -not -path "*/dist/*" -not -path "*/build/*" -not -path "*/.next/*" -not -path "*/coverage/*" \
    -print0 | while IFS= read -r -d '' f; do
      echo ""
      echo "----- FILE: $f -----"
      cat "$f"
    done
} > project_dump.txt

echo "Selesai. Ukuran file:"
wc -l project_dump.txt
ls -lh project_dump.txt