# Diagram Module

`src/diagram`: a developer/introspection tool, not a domain module. Renders a live Mermaid dependency graph of the running application using [`nestjs-spelunker`](https://www.npmjs.com/package/nestjs-spelunker).

## Structure

```
diagram/
├── diagram.module.ts
├── diagram.controller.ts   # @Controller('diagram')
└── diagram.service.ts      # holds a reference to the live Nest app instance, walks its module graph
```

`DiagramService.setApp(app)` is called once from `src/main.ts` after the Nest application is created, so the service can introspect the actual running module graph rather than a static analysis.

## Endpoints

`@Controller('diagram')`: no guard.

| Method | Route | Description |
|---|---|---|
| GET | `/v1/diagram` | Returns an HTML page rendering three Mermaid graphs (Core Infrastructure, Business Modules, Queue/Worker Modules) of the live module dependency graph |
