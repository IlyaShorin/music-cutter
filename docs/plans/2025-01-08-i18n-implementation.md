# i18n Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Добавить поддержку английского и русского языков в Music Cutter с переключателем рядом с темой.

**Architecture:** react-i18next с TypeScript типизацией, переводы в TS модулях src/locales/, провайдер в main.tsx, LanguageToggle компонент в App.tsx.

**Tech Stack:** react-i18next, i18next, TypeScript, Chakra UI

---

## Task 1: Install dependencies

**Files:**
- Modify: `package.json`

**Step 1: Install i18next and react-i18next**

```bash
npm install i18next react-i18next
```

Expected: Packages added to package.json and node_modules

**Step 2: Commit**

```bash
git add package.json package-lock.json
git commit -m "deps: install i18next and react-i18next"
```

---

## Task 2: Create locales structure

**Files:**
- Create: `src/locales/en.ts`
- Create: `src/locales/ru.ts`
- Create: `src/locales/index.ts`

**Step 1: Create English translations file**

`src/locales/en.ts`:

```typescript
export const en = {
  common: {
    language: 'Language',
    theme: 'Theme',
  },
  tabs: {
    audioCutter: 'Audio Cutter',
    batchCutter: 'Batch Cutter',
  },
  audioCutter: {
    selectFile: 'Select Audio File',
    startTime: 'Start Time',
    endTime: 'End Time',
    outputFileName: 'Output File Name',
    metadata: 'Metadata',
    title: 'Title',
    artist: 'Artist',
    album: 'Album',
    cut: 'Cut Fragment',
    processing: 'Processing...',
    success: 'Fragment cut successfully!',
    error: 'Error cutting fragment',
  },
  batchCutter: {
    selectFile: 'Select Source File',
    outputFolder: 'Output Folder',
    selectFolder: 'Select Folder',
    tracklist: 'Tracklist',
    parseFromMetadata: 'Parse from Metadata',
    defaultArtist: 'Default Artist',
    addTrack: 'Add Track',
    removeTrack: 'Remove Track',
    process: 'Process All',
    processing: 'Processing...',
    success: 'Processed {{count}} tracks',
    error: 'Error processing tracks',
  },
  languageToggle: {
    tooltip: 'Switch language',
    switched: 'Language changed to English',
  },
  themeToggle: {
    tooltip: 'Switch theme',
  },
} as const

export type Translations = typeof en
```

**Step 2: Create Russian translations file**

`src/locales/ru.ts`:

```typescript
import type { Translations } from './en'

export const ru: Translations = {
  common: {
    language: 'Язык',
    theme: 'Тема',
  },
  tabs: {
    audioCutter: 'Нарезка',
    batchCutter: 'Пакетная нарезка',
  },
  audioCutter: {
    selectFile: 'Выбрать аудиофайл',
    startTime: 'Время начала',
    endTime: 'Время окончания',
    outputFileName: 'Имя выходного файла',
    metadata: 'Метаданные',
    title: 'Название',
    artist: 'Исполнитель',
    album: 'Альбом',
    cut: 'Вырезать фрагмент',
    processing: 'Обработка...',
    success: 'Фрагмент успешно вырезан!',
    error: 'Ошибка при вырезании',
  },
  batchCutter: {
    selectFile: 'Выбрать исходный файл',
    outputFolder: 'Папка для сохранения',
    selectFolder: 'Выбрать папку',
    tracklist: 'Треклист',
    parseFromMetadata: 'Получить из метаданных',
    defaultArtist: 'Исполнитель по умолчанию',
    addTrack: 'Добавить трек',
    removeTrack: 'Удалить трек',
    process: 'Обработать все',
    processing: 'Обработка...',
    success: 'Обработано {{count}} треков',
    error: 'Ошибка при обработке',
  },
  languageToggle: {
    tooltip: 'Сменить язык',
    switched: 'Язык изменён на русский',
  },
  themeToggle: {
    tooltip: 'Сменить тему',
  },
}
```

**Step 3: Create locales index**

`src/locales/index.ts`:

```typescript
export { en } from './en'
export { ru } from './ru'
export type { Translations } from './en'
```

**Step 4: Commit**

```bash
git add src/locales/
git commit -m "feat(i18n): add translation files for EN and RU"
```

---

## Task 3: Create i18n config

**Files:**
- Create: `src/i18n/config.ts`
- Create: `src/i18n/types.ts`
- Create: `src/i18n/useTypedTranslation.ts`
- Create: `src/i18n/index.ts`

**Step 1: Create i18n types**

`src/i18n/types.ts`:

```typescript
import { en } from '@/locales/en'

export type Translations = typeof en

declare module 'react-i18next' {
  export interface Resources {
    translation: Translations
  }
}
```

**Step 2: Create typed hook**

`src/i18n/useTypedTranslation.ts`:

```typescript
import { useTranslation as usei18n } from 'react-i18next'

export function useTypedTranslation() {
  const { t, ...rest } = usei18n()

  return {
    t: (key: keyof Translations, params?: Record<string, unknown>) =>
      t(key as string, params),
    ...rest,
  }
}

import type { Translations } from './types'
```

**Step 3: Create i18n config**

`src/i18n/config.ts`:

```typescript
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { en, ru } from '@/locales'

const STORAGE_KEY = 'music-cutter-language'

const savedLanguage = localStorage.getItem(STORAGE_KEY) as 'en' | 'ru' | null

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ru: { translation: ru },
  },
  lng: savedLanguage || 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
})

export const setLanguage = (lang: 'en' | 'ru') => {
  i18n.changeLanguage(lang)
  localStorage.setItem(STORAGE_KEY, lang)
}

export const getLanguage = (): 'en' | 'ru' => {
  return i18n.language as 'en' | 'ru'
}

export default i18n
```

**Step 4: Create i18n index**

`src/i18n/index.ts`:

```typescript
export { useTypedTranslation } from './useTypedTranslation'
export { setLanguage, getLanguage } from './config'
export type { Translations } from './types'
```

**Step 5: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors

**Step 6: Commit**

```bash
git add src/i18n/
git commit -m "feat(i18n): add i18n config and typed hook"
```

---

## Task 4: Add i18n provider to main.tsx

**Files:**
- Modify: `src/main.tsx`

**Step 1: Import and configure i18n**

Add at top of `src/main.tsx`:

```typescript
import { I18nextProvider } from 'react-i18next'
import i18n from '@/i18n/config'
```

**Step 2: Wrap app with I18nextProvider**

Modify the render to wrap `<App />`:

```typescript
<I18nextProvider i18n={i18n}>
  <ThemeProvider attribute="class" storageKey="music-cutter-theme" defaultTheme="light">
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </ThemeProvider>
</I18nextProvider>
```

**Step 3: Verify app runs**

```bash
npm run tauri dev
```

Expected: App launches without errors

**Step 4: Commit**

```bash
git add src/main.tsx
git commit -m "feat(i18n): add i18n provider to app"
```

---

## Task 5: Create LanguageToggle component

**Files:**
- Create: `src/components/LanguageToggle.tsx`

**Step 1: Create LanguageToggle component**

`src/components/LanguageToggle.tsx`:

```typescript
import { IconButton } from '@chakra-ui/react'
import { LuGlobe } from 'react-icons/lu'
import { useTranslation } from 'react-i18next'
import { useToast } from '@chakra-ui/react'
import { setLanguage } from '@/i18n'

export function LanguageToggle() {
  const { i18n } = useTranslation()
  const toast = useToast()
  const currentLang = i18n.language as 'en' | 'ru'

  const toggleLanguage = () => {
    const newLang = currentLang === 'en' ? 'ru' : 'en'
    setLanguage(newLang)

    toast({
      title: newLang === 'en' ? 'Language changed to English' : 'Язык изменён на русский',
      status: 'success',
      duration: 2000,
      isClosable: true,
    })
  }

  return (
    <IconButton
      aria-label="Switch language"
      icon={<LuGlobe />}
      onClick={toggleLanguage}
      variant="ghost"
      size="sm"
    />
  )
}
```

**Step 2: Export from components index**

If `src/components/index.ts` exists, add:

```typescript
export { LanguageToggle } from './LanguageToggle'
```

**Step 3: Commit**

```bash
git add src/components/
git commit -m "feat(i18n): add LanguageToggle component"
```

---

## Task 6: Add LanguageToggle to App.tsx

**Files:**
- Modify: `src/App.tsx`

**Step 1: Import LanguageToggle**

Add to imports in `src/App.tsx`:

```typescript
import { LanguageToggle } from '@/components/LanguageToggle'
```

**Step 2: Add LanguageToggle next to ThemeToggle**

Find where `ThemeToggle` is rendered (around line 48-50) and wrap both in Flex:

```typescript
<Flex gap={2}>
  <LanguageToggle />
  <ThemeToggle />
</Flex>
```

Import Flex from Chakra if not already imported.

**Step 3: Verify UI**

```bash
npm run tauri dev
```

Expected: Two buttons side by side in top-right corner

**Step 4: Test language switching**

Click the globe button and verify:
- Toast notification appears
- Subsequent clicks toggle between languages

**Step 5: Commit**

```bash
git add src/App.tsx
git commit -m "feat(i18n): add LanguageToggle to app header"
```

---

## Task 7: Translate App.tsx tabs

**Files:**
- Modify: `src/App.tsx`

**Step 1: Use useTypedTranslation in App**

Add import:

```typescript
import { useTypedTranslation } from '@/i18n'
```

Add hook in component:

```typescript
const { t } = useTypedTranslation()
```

**Step 2: Translate tab labels**

Find tab labels and replace with t() calls:

```typescript
// Before
<TabsList>
  <TabsTrigger value="audio-cutter">Audio Cutter</TabsTrigger>
  <TabsTrigger value="batch-cutter">Batch Cutter</TabsTrigger>
</TabsList>

// After
<TabsList>
  <TabsTrigger value="audio-cutter">{t('tabs.audioCutter')}</TabsTrigger>
  <TabsTrigger value="batch-cutter">{t('tabs.batchCutter')}</TabsTrigger>
</TabsList>
```

**Step 3: Test language switching**

```bash
npm run tauri dev
```

Toggle language and verify tab labels change

**Step 4: Commit**

```bash
git add src/App.tsx
git commit -m "feat(i18n): translate tab labels"
```

---

## Task 8: Translate AudioCutter feature

**Files:**
- Modify: `src/features/audioCutter/components/AudioCutter.tsx` (or similar path)

**Step 1: Find AudioCutter component file**

```bash
find src/features -name "*AudioCutter*" -o -name "*audioCutter*"
```

**Step 2: Add useTypedTranslation hook**

```typescript
import { useTypedTranslation } from '@/i18n'

const { t } = useTypedTranslation()
```

**Step 3: Replace all UI strings with t() calls**

```typescript
// Before
<Button>Select File</Button>
<Label>Start Time</Label>

// After
<Button>{t('audioCutter.selectFile')}</Button>
<Label>{t('audioCutter.startTime')}</Label>
```

Replace strings:
- "Select Audio File" → `t('audioCutter.selectFile')`
- "Start Time" → `t('audioCutter.startTime')`
- "End Time" → `t('audioCutter.endTime')`
- "Output File Name" → `t('audioCutter.outputFileName')`
- "Metadata" → `t('audioCutter.metadata')`
- "Title" → `t('audioCutter.title')`
- "Artist" → `t('audioCutter.artist')`
- "Album" → `t('audioCutter.album')`
- "Cut Fragment" / "Cut" → `t('audioCutter.cut')`

**Step 4: Test**

```bash
npm run tauri dev
```

Verify all strings appear and switch correctly

**Step 5: Commit**

```bash
git add src/features/audioCutter/
git commit -m "feat(i18n): translate AudioCutter feature"
```

---

## Task 9: Translate BatchCutter feature

**Files:**
- Modify: `src/features/batchCutter/components/BatchCutter.tsx` (or similar path)

**Step 1: Find BatchCutter component file**

```bash
find src/features -name "*BatchCutter*" -o -name "*batchCutter*"
```

**Step 2: Add useTypedTranslation hook**

```typescript
import { useTypedTranslation } from '@/i18n'

const { t } = useTypedTranslation()
```

**Step 3: Replace all UI strings with t() calls**

```typescript
// Examples
"Select Source File" → t('batchCutter.selectFile')
"Output Folder" → t('batchCutter.outputFolder')
"Select Folder" → t('batchCutter.selectFolder')
"Tracklist" → t('batchCutter.tracklist')
"Parse from Metadata" → t('batchCutter.parseFromMetadata')
"Default Artist" → t('batchCutter.defaultArtist')
"Add Track" → t('batchCutter.addTrack')
"Remove Track" → t('batchCutter.removeTrack')
"Process All" → t('batchCutter.process')
```

**Step 4: Test**

```bash
npm run tauri dev
```

**Step 5: Commit**

```bash
git add src/features/batchCutter/
git commit -m "feat(i18n): translate BatchCutter feature"
```

---

## Task 10: Translate ThemeToggle tooltip

**Files:**
- Modify: `src/components/ThemeToggle.tsx`

**Step 1: Add translation to tooltip**

```typescript
import { useTypedTranslation } from '@/i18n'

// In component
const { t } = useTypedTranslation()

// Replace tooltip text
<Tooltip label={t('themeToggle.tooltip')}>
```

**Step 2: Commit**

```bash
git add src/components/ThemeToggle.tsx
git commit -m "feat(i18n): translate ThemeToggle tooltip"
```

---

## Task 11: Final verification and cleanup

**Files:**
- All modified files

**Step 1: Run TypeScript check**

```bash
npx tsc --noEmit
```

Expected: No errors

**Step 2: Run linter**

```bash
npm run lint
```

Expected: No errors

**Step 3: Run cargo check**

```bash
cd src-tauri && cargo check
```

Expected: No errors

**Step 4: Build app**

```bash
npm run tauri build
```

Expected: Successful build

**Step 5: Manual testing**

Test both languages:
1. Launch app
2. Toggle to Russian
3. Navigate all tabs
4. Test audio cutter
5. Test batch cutter
6. Toggle back to English
7. Verify all strings

**Step 6: Final commit if any fixes needed**

```bash
git add .
git commit -m "feat(i18n): complete i18n implementation"
```

---

## Summary

After completion:
- App supports EN and RU languages
- Language persists across restarts via localStorage
- Toggle button next to theme switcher
- All UI strings translated
- Full TypeScript type safety
