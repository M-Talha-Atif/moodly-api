# Insights Module

`src/insights`: aggregated analytics overview for a single user (mood trends and related derived stats).

## Structure

```
insights/
├── insights.module.ts
├── controller/
│   └── insights.controller.ts   # @Controller('insights')
└── services/
    └── insights.service.ts
```

## Endpoints

`@Controller('insights')`, `JwtCookieGuard`

| Method | Route | Description |
|---|---|---|
| GET | `/insights` | User insight overview. Optional `?moodDays=N` controls the mood-trend window size |
