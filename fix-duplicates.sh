#\!/bin/bash

# Script para corrigir a duplicação de scripts nos arquivos HTML
# Este script remove as inclusões duplicadas de scripts geradas pelo update-html-cookies.js

find /home/fcs/Documents/website -name "*.html" -type f -exec sed -i "s/    <\!-- Scripts para manipulação de cookies e acessibilidade -->\\n    <script src=\\\"\\(.*\\)\/js\/cookie-utils.js\\\".*>\\n    <script src=\\\"\\1\/js\/cookie-consent.js\\\".*>\\n    <script src=\\\"\\1\/js\/accessibility.js\\\".*>\\n    <script src=\\\"\\1\/js\/accessibility-bar.js\\\".*>\\n\\n    <\!-- Scripts para manipulação de cookies e acessibilidade -->\\n    <script src=\\\"\\1\/js\/cookie-utils.js\\\".*>\\n    <script src=\\\"\\1\/js\/cookie-consent.js\\\".*>\\n    <script src=\\\"\\1\/js\/accessibility.js\\\".*>\\n    <script src=\\\"\\1\/js\/accessibility-bar.js\\\".*>/    <\!-- Scripts para manipulação de cookies e acessibilidade -->\\n    <script src=\\\"\\1\/js\/cookie-utils.js\\\".*>\\n    <script src=\\\"\\1\/js\/cookie-consent.js\\\".*>\\n    <script src=\\\"\\1\/js\/accessibility.js\\\".*>\\n    <script src=\\\"\\1\/js\/accessibility-bar.js\\\".*>/g" {} \;

echo "Correção de duplicação de scripts concluída\!"
