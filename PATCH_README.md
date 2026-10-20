# Parche de Corrección: Empaquetado Android Agenda YA

## Resumen

Este parche corrige el empaquetado Android para generar un APK funcional de Agenda YA mediante GitHub Actions.

## Archivos a modificar/crear

### 1. `package.json`

Reemplazar el contenido completo con la versión en `package.json.patch`.

**Cambios principales:**
- Agregar scripts de verificación de web assets
- Especificar versiones de Node.js y npm compatibles
- Mejorar documentación del proyecto

### 2. `scripts/verify-web-assets.js` (CREAR)

Crear este archivo nuevo en la raíz del proyecto.

**Propósito:**
- Verificar que `login.html`, `dashboard.html` y `config.js` existan antes de compilar
- Validar que `capacitor.config.json` tenga los valores correctos:
  - `appId: "cl.agendaya.app"`
  - `appName: "Agenda YA"`
  - `webDir: "www"`
- Falla la compilación con mensajes claros si falta algún recurso

### 3. `.github/workflows/android-debug.yml`

Reemplazar el contenido completo con la versión en `android-debug.yml.patch`.

**Cambios principales:**
- Actualizar Node.js a versión 20 (compatible con Capacitor 7.4.3)
- Usar Java 17 en lugar de 21
- Agregar step explícito de verificación de web assets
- Agregar configuración de Android SDK
- Mejorar manejo de errores y timeouts

## Pasos para aplicar el parche

### Opción A: Hacerlo manualmente (recomendado)

1. Clona o haz fork de `P-Renault/agenda-ya-android`
2. Crea una rama: `git checkout -b fix/android-packaging`
3. Reemplaza/crea los 3 archivos según lo indicado abajo
4. Haz commit: `git commit -m "fix: Corregir empaquetado Android y workflow"`
5. Haz push: `git push origin fix/android-packaging`
6. En GitHub, abre una PR desde tu rama a `main`

### Opción B: Usar git apply (si tienes un parche .patch)

```bash
git apply patch-android-packaging.patch
```

## Verificación antes de compilar

Antes de ejecutar el workflow, verifica:

```bash
# Verificar que existen los archivos críticos
ls -la www/login.html
ls -la www/dashboard.html
ls -la www/config.js
ls -la www/assets
ls -la www/supabase

# Ejecutar la verificación de web assets localmente
node scripts/verify-web-assets.js
```

## Ejecutar la compilación

1. Ve a: https://github.com/P-Renault/agenda-ya-android/actions
2. Selecciona: "Agenda YA Android - APK de pruebas"
3. Click en "Run workflow"
4. Selecciona la rama `fix/android-packaging`
5. Click en "Run workflow"
6. Espera ~30-40 minutos
7. Descarga el artefacto: `AgendaYA-Android-debug-APK`

## Contenido del APK generado

- **Nombre:** `app-debug.apk`
- **Ubicación:** `android/app/build/outputs/apk/debug/app-debug.apk`
- **Inicio:** `login.html` (no página pública)
- **Configuración:** `appId: cl.agendaya.app`, `appName: Agenda YA`
- **Web:** Carpeta `www/` sincronizada con Capacitor
- **Autenticación:** Flujo Supabase desde `config.js`

## Troubleshooting

### Error: "Falta capacitor.config.json"

→ Verifica que el archivo exista en la raíz: `capacitor.config.json`

### Error: "Falta www/login.html"

→ Verifica que los archivos de `P-Renault/somos-agenda` estén en `www/`

### Error: "El appId debe ser cl.agendaya.app"

→ Revisa `capacitor.config.json` línea 2

### Build timeout en Android

→ El workflow tiene timeout de 45 minutos. Si excede, revisa la versión de Gradle y el emulador Android.

## Archivos incluidos en este parche

```
fix-android-packaging/
├── package.json
├── scripts/
│   └── verify-web-assets.js
└── .github/workflows/
    └── android-debug.yml
```

## Notas de seguridad

- ✅ No incluye claves privadas
- ✅ No incluye credenciales de Supabase (solo anon key pública)
- ✅ No incluye secretos de Flow
- ✅ GitHub Actions tendrá acceso a los tokens de lectura estándar

## Preguntas frecuentes

**¿Por qué Node 20 y no 22?**
Capacitor 7.4.3 es compatible hasta Node 20. La versión 22 puede tener incompatibilidades.

**¿Por qué Java 17 y no 21?**
Gradle y Android Gradle Plugin (AGP) 8.x son más estables con Java 17. Java 21 puede causar conflictos de módulos.

**¿Es necesario tener Android Studio instalado localmente?**
No. GitHub Actions ejecuta la compilación en runners de Ubuntu. Solo necesitas git y permisos de push.

**¿Cuánto tiempo tarda la compilación?**
Aproximadamente 30-40 minutos, dependiendo de la carga de GitHub Actions.

## Contacto

Si tienes problemas al aplicar el parche, abre un issue en el repo o revisa los logs del workflow en Actions.
