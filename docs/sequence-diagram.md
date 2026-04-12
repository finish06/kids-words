# Sequence Diagrams — Kids Words

Request flow diagrams generated from source code. Updated via `/add:docs`.

## Quiz Round (Core User Flow)

The primary user journey: select a category, pick quiz length, answer word-image matches.

```mermaid
sequenceDiagram
    participant Child as Child (Browser)
    participant React as React Frontend
    participant API as FastAPI Backend
    participant DB as PostgreSQL

    Note over Child, DB: 1. Category Selection
    Child->>React: Tap category card
    React->>API: GET /api/categories/{slug}/words
    API->>DB: SELECT category + words (eager load)
    DB-->>API: Category + Word[]
    API-->>React: {category, words[]} (shuffled)
    React->>React: Show quiz length picker (5/10/20)

    Note over Child, DB: 2. Quiz Round
    Child->>React: Select "5 words"
    React->>React: useRound() — shuffle words, pick 3 options per round
    loop Each word (1 to 5)
        React->>Child: Show word + 3 image options
        Child->>React: Tap an image
        React->>API: POST /api/results {word_id, selected_word_id, is_correct, attempt}
        API->>DB: INSERT match_result
        alt First-attempt correct
            API->>DB: UPSERT word_progress (increment count, compute star level)
            DB-->>API: StarUpdate {new_star_level, just_mastered}
        end
        API-->>React: {recorded: true, star_update}
        alt Correct answer
            React->>Child: Green flash → advance (1.2s delay)
        else Wrong answer
            React->>Child: Red flash → retry (0.6s delay)
        end
    end

    Note over Child, DB: 3. Round Complete
    React->>Child: "Great Job!" + word list with star updates
    Child->>React: "Play Again" or "More Categories"
```

## Profile Selection

How children pick their profile on app load.

```mermaid
sequenceDiagram
    participant Child as Child (Browser)
    participant React as React Frontend
    participant API as FastAPI Backend
    participant DB as PostgreSQL

    Child->>React: Open app
    React->>API: GET /api/profiles
    API->>DB: SELECT profiles + parent_settings
    DB-->>API: Profile[] + pin_set flag

    alt Only Guest profile exists
        React->>React: Auto-select Guest → go to categories
    else Multiple profiles
        React->>Child: Show "Who's Playing?" picker
        Child->>React: Tap profile card
        React->>React: Set active profile → go to categories
    end
```

## Parent PIN & Profile Management

Parent flow for managing child profiles (PIN-protected).

```mermaid
sequenceDiagram
    participant Parent as Parent (Browser)
    participant React as React Frontend
    participant API as FastAPI Backend
    participant DB as PostgreSQL

    Parent->>React: Tap "Manage Profiles"

    alt PIN not set
        React->>Parent: "Set a Parent PIN" (4 digits)
        Parent->>React: Enter PIN + confirm PIN
        alt PINs match
            React->>API: POST /api/profiles/setup {pin}
            API->>DB: INSERT parent_settings (hashed PIN)
            API-->>React: 201 Created
            React->>Parent: Show manage screen
        else PINs don't match
            React->>Parent: Reset to "Set a Parent PIN"
        end
    else PIN already set
        React->>Parent: "Enter Parent PIN"
        Parent->>React: Enter 4 digits
        React->>API: POST /api/profiles/verify-pin {pin}
        API->>DB: SELECT parent_settings, verify hash
        alt Correct
            API-->>React: {valid: true}
            React->>Parent: Show manage screen
        else Wrong
            API-->>React: {valid: false}
            React->>Parent: "Wrong PIN" → clear dots
        end
    end

    Note over Parent, DB: Profile CRUD
    alt Add child
        Parent->>React: Tap "Add Child"
        Parent->>React: Enter name + pick color
        React->>API: POST /api/profiles {name, color, pin}
        API->>DB: INSERT profile
        API-->>React: ProfileResponse
    else Edit child
        Parent->>React: Tap existing profile
        Parent->>React: Change name / color
        React->>API: PUT /api/profiles/{id} {name, color, pin}
        API->>DB: UPDATE profile
        API-->>React: ProfileResponse
    else Delete child
        Parent->>React: Tap "Delete Profile"
        React->>Parent: Confirm delete warning
        Parent->>React: "Confirm Delete"
        React->>API: DELETE /api/profiles/{id} {pin}
        API->>DB: DELETE profile
        API-->>React: 204 No Content
    end
```

## Progress Tracking

How the app tracks and displays word mastery.

```mermaid
sequenceDiagram
    participant React as React Frontend
    participant API as FastAPI Backend
    participant DB as PostgreSQL

    Note over React, DB: View all categories progress
    React->>API: GET /api/progress?profile_id=...
    API->>DB: SELECT categories with word_progress aggregation
    DB-->>API: Category[] with mastery_percentage per category
    API-->>React: AllProgressResponse

    Note over React, DB: View single category word list
    React->>API: GET /api/progress/{slug}?profile_id=...
    API->>DB: SELECT words + word_progress for category
    DB-->>API: Word[] with star_level per word
    API-->>React: CategoryProgressResponse {words with stars}
    React->>React: Render word list with star indicators
```

## Health Check

Infrastructure monitoring endpoint.

```mermaid
sequenceDiagram
    participant Monitor as Monitor / Load Balancer
    participant API as FastAPI Backend
    participant DB as PostgreSQL

    Monitor->>API: GET /api/health
    API->>DB: SELECT 1 (latency check)
    alt DB healthy
        DB-->>API: OK (latency_ms)
        API-->>Monitor: 200 {status: "healthy", version, uptime, dependencies: [{db: healthy}]}
    else DB down
        DB--xAPI: Connection error
        API-->>Monitor: 200 {status: "degraded", dependencies: [{db: unhealthy, error}]}
    end
```

## Database Seeding

How the idempotent seed script populates categories and words.

```mermaid
sequenceDiagram
    participant Entry as Docker Entrypoint
    participant Alembic as Alembic
    participant Seed as seed.py
    participant DB as PostgreSQL

    Entry->>Entry: Check if alembic_version table exists
    alt Existing DB without migration history
        Entry->>Alembic: alembic stamp head
    end
    Entry->>Alembic: alembic upgrade head
    Alembic->>DB: Apply pending migrations
    DB-->>Alembic: Schema up to date
    Entry->>Entry: Start uvicorn

    Note over Seed, DB: Manual seed run
    Seed->>Seed: Load SEED_DATA (Animals, Colors, Food)
    loop Each category
        Seed->>DB: SELECT category by slug
        alt Not exists
            Seed->>DB: INSERT category
        end
        loop Each word
            Seed->>DB: SELECT word by (text, category_id)
            alt Not exists
                Seed->>DB: INSERT word
            else Exists, image_url changed
                Seed->>DB: UPDATE word.image_url
            else Exists, unchanged
                Seed->>Seed: Skip (no-op)
            end
        end
    end
    Seed-->>Seed: "Database already up to date" or "{N} words seeded"
```

---

*Last updated: 2026-04-12. Generated from source by `/add:docs`. 13 routes across 5 handler groups.*
