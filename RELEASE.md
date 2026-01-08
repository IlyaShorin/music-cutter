# Release Guide

## Автоматические релизы

Релизы создаются **автоматически** при пуше в `main` с использованием [Conventional Commits](https://www.conventionalcommits.org/).

## Как работает

1. Мержите PR в `main` с conventional commit сообщением
2. GitHub Actions анализирует коммиты и определяет тип версии
3. Создаётся тег и релиз с автоматическим changelog
4. Запускается сборка приложения для macOS и Windows
5. Установщики появляются на странице Releases

## Conventional Commits

```
<type>[optional scope]: <description>

[optional body]
```

### Типы коммитов и их влияние на версию

| Type | Действие | Пример |
|------|----------|--------|
| `feat` | minor (1.1.0 → 1.2.0) | `feat: add dark mode` |
| `fix` | patch (1.1.0 → 1.1.1) | `fix: correct progress bar` |
| `chore` | patch | `chore: update dependencies` |
| `docs` | patch | `docs: update readme` |
| `refactor` | patch | `refactor: improve code structure` |
| `perf` | patch | `perf: optimize render` |
| `test` | patch | `test: add unit tests` |
| `style` | patch | `style: format code` |
| `build` | patch | `build: update webpack config` |
| `ci` | patch | `ci: fix github actions` |

### Breaking changes

Добавьте `!` после типа или `BREAKING CHANGE:` в теле:

```
feat!: remove deprecated API

или

feat: remove deprecated API

BREAKING CHANGE: this removes the old API
```

Результат: major (1.1.0 → 2.0.0)

## Локальная проверка

```bash
# Посмотреть что будет в релизе (без создания)
npm run release:dry
```

## Примеры

### Добавление новой функции
```bash
git commit -m "feat: add volume control"
```

### Исправление бага
```bash
git commit -m "fix: resolve memory leak in audio processing"
```

### Breaking change
```bash
git commit -m "feat!: migrate to new API

BREAKING CHANGE: old methods removed, use new API instead"
```

## Ссылки

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Release](https://github.com/semantic-release/semantic-release)
