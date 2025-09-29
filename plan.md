# Plan Pracy - Multiplication Table Teacher

## Przegląd Projektu
Aplikacja webowa do nauki tabliczki mnożenia (2-12) z adaptacyjnym systemem śledzenia postępów. Technologie: Vue 3, Pinia, Tailwind CSS, localStorage.

## Etapy Realizacji

### Etap 1: Inicjalizacja Projektu ✅
**Czas: ~30 min**
- [x] Stworzenie projektu Vue 3 z Vite
- [x] Konfiguracja Tailwind CSS
- [x] Instalacja Pinia
- [x] Struktura folderów zgodna z architekturą
- [x] Podstawowa konfiguracja

### Etap 2: Store i Logika Biznesowa
**Czas: ~45 min**
- [ ] Stworzenie multiplicationStore.js z Pinia
- [ ] Implementacja stanu aplikacji (stats, currentView, lesson state)
- [ ] Gettery: getQuestionStats, getAverageTime, getColor, getSelectionWeight
- [ ] Akcje: startQuestion, submitAnswer, startLesson, navigation
- [ ] Logika localStorage (save/load)
- [ ] Algorytm ważonego wyboru pytań do lekcji

### Etap 3: Komponenty Współdzielone
**Czas: ~30 min**
- [ ] StatusCircle.vue (kluczowy komponent wielokrotnego użytku)
- [ ] BackButton.vue
- [ ] Implementacja logiki kolorów i wyświetlania
- [ ] Testy podstawowej funkcjonalności

### Etap 4: Widok Główny (BoardView)
**Czas: ~60 min**
- [ ] BoardView.vue - główny layout
- [ ] MultiplicationGrid.vue - siatka 11x11
- [ ] LessonButton.vue - przycisk rozpoczęcia lekcji
- [ ] ColorLegend.vue + LegendItem.vue - legenda kolorów
- [ ] AppHeader.vue - nagłówek aplikacji
- [ ] Integracja z store

### Etap 5: Widok Pytania (QuestionView)
**Czas: ~60 min**
- [ ] QuestionView.vue - główny layout pytania
- [ ] QuestionContent.vue - zawartość pytania
- [ ] Timer.vue - licznik czasu
- [ ] QuestionDisplay.vue - wyświetlanie pytania (7 × 8)
- [ ] AnswerDisplay.vue - wyświetlanie odpowiedzi (= 56)
- [ ] HistoryDots.vue - historia poprzednich prób
- [ ] AnswerButtons.vue + WrongButton.vue + CorrectButton.vue
- [ ] QuestionHeader.vue + ProgressIndicator.vue

### Etap 6: Composables i Utilities
**Czas: ~30 min**
- [ ] useTimer.js - logika timera
- [ ] useColorCalculation.js - obliczanie kolorów
- [ ] useWeightedSelection.js - algorytm wyboru pytań
- [ ] constants.js - stałe (kolory, progi czasowe)
- [ ] storage.js - helpers dla localStorage

### Etap 7: Główny Komponent i Routing
**Czas: ~30 min**
- [ ] App.vue - główny komponent
- [ ] Logika przełączania widoków (board/question)
- [ ] Inicjalizacja store
- [ ] Globalne style

### Etap 8: Stylowanie i Responsywność
**Czas: ~45 min**
- [ ] Implementacja mobile-first design
- [ ] Responsywne breakpointy
- [ ] Dostosowanie siatki do różnych rozmiarów ekranu
- [ ] Optymalizacja touch targets (min 28px)
- [ ] Gradient tła i style kart

### Etap 9: Testy i Debugowanie
**Czas: ~60 min**
- [ ] Testy funkcjonalności store
- [ ] Testy komponentów (StatusCircle, Timer, etc.)
- [ ] Testy integracyjne (przepływ lekcji)
- [ ] Debugowanie i poprawki
- [ ] Walidacja zgodności z specyfikacją

### Etap 10: Optymalizacja i Finalizacja
**Czas: ~30 min**
- [ ] Optymalizacja wydajności
- [ ] Accessibility improvements
- [ ] Finalne testy na różnych urządzeniach
- [ ] Dokumentacja użytkowania
- [ ] Przygotowanie do wdrożenia

## Kluczowe Decyzje Techniczne

### Struktura Komponentów
```
src/
├── stores/multiplicationStore.js
├── views/BoardView.vue, QuestionView.vue
├── components/
│   ├── shared/StatusCircle.vue, BackButton.vue
│   ├── board/LessonButton.vue, MultiplicationGrid.vue, ColorLegend.vue
│   ├── question/Timer.vue, QuestionDisplay.vue, AnswerButtons.vue
│   └── layout/AppHeader.vue, QuestionContent.vue
├── composables/useTimer.js, useColorCalculation.js
└── utils/constants.js, storage.js
```

### Logika Kolorów (StatusCircle)
- Szary: nie próbowano
- Zielony: ≤3s (doskonały)
- Limonkowy: ≤5s (dobry)
- Żółty: ≤10s (ok)
- Pomarańczowy: ≤15s (wolny)
- Czerwony: >15s lub błędna odpowiedź

### Algorytm Wyboru Pytań (Lekcja)
- Waga bazowa: 1
- Nie zadawane: +3
- Za każdą błędną odpowiedź: +2
- Wolne odpowiedzi: +1 do +3 (zależnie od czasu)

## Commity po Każdym Etapie
Każdy ukończony etap będzie commitowany z opisowym komunikatem:
- `feat: initialize Vue 3 project with Pinia and Tailwind`
- `feat: implement multiplication store with business logic`
- `feat: create reusable StatusCircle component`
- itd.

## Następne Kroki
1. Rozpocząć od Etapu 2 (Store) - fundament aplikacji
2. Następnie Etap 3 (StatusCircle) - kluczowy komponent
3. Kontynuować zgodnie z planem
4. Testować na bieżąco każdy etap
