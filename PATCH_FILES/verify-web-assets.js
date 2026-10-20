const fs = require('fs');
const path = require('path');

const root = process.cwd();
const fail = (message) => {
  console.error(`ERROR: ${message}`);
  process.exit(1);
};

// Validar capacitor.config.json
const capacitorConfigPath = path.join(root, 'capacitor.config.json');
if (!fs.existsSync(capacitorConfigPath)) {
  fail('Falta capacitor.config.json en la raíz del proyecto.');
}

let capacitorConfig;
try {
  capacitorConfig = JSON.parse(fs.readFileSync(capacitorConfigPath, 'utf8'));
} catch (error) {
  fail(`capacitor.config.json no es un JSON válido: ${error.message}`);
}

if (capacitorConfig.appId !== 'cl.agendaya.app') {
  fail(`El appId debe ser "cl.agendaya.app". Valor actual: ${String(capacitorConfig.appId ?? 'undefined')}`);
}

if (capacitorConfig.appName !== 'Agenda YA') {
  fail(`El appName debe ser "Agenda YA". Valor actual: ${String(capacitorConfig.appName ?? 'undefined')}`);
}

if (capacitorConfig.webDir !== 'www') {
  fail(`El webDir debe ser "www". Valor actual: ${String(capacitorConfig.webDir ?? 'undefined')}`);
}

// Validar archivos y carpetas requeridas
const requiredFiles = [
  'www/index.html',
  'www/login.html',
  'www/config.js',
  'www/agenda-ya-shell.css',
  'www/dashboard.js',
  'www/auth.js',
  'www/assets',
  'www/supabase'
];

for (const relativePath of requiredFiles) {
  const absolutePath = path.join(root, relativePath);
  if (!fs.existsSync(absolutePath)) {
    fail(`Falta el recurso requerido: ${relativePath}`);
  }
}

// Validar que login.html sea la pantalla correcta
const loginHtmlPath = path.join(root, 'www/login.html');
const loginHtml = fs.readFileSync(loginHtmlPath, 'utf8');
if (!loginHtml.includes('Agenda Ya') && !loginHtml.includes('Agenda YA')) {
  fail('El archivo www/login.html no parece ser la pantalla de acceso correcta de Agenda YA.');
}

console.log('✓ Verificación de web assets OK: login, dashboard, recursos, Supabase y Capacitor configurados correctamente.');
