#!/usr/bin/env bash
set -euo pipefail

failure=0

while IFS= read -r file; do
	lines=$(wc -l < "$file")
	if (( lines > 300 )); then
		echo "ERROR: $file has $lines lines; split the module before merging."
		failure=1
	fi
	if [[ "$file" == *.tsx ]] && (( lines > 150 )); then
		echo "ERROR: $file has $lines lines; split the component before merging."
		failure=1
	fi
done < <(find src -type f \( -name '*.ts' -o -name '*.tsx' \) -print | sort)

if (( failure != 0 )); then
	exit 1
fi

echo "Architecture size check passed."
