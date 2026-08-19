import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { DiagramService } from './diagram.service';
import { JwtCookieGuard } from 'src/auth/guards/jwt-cookie.guard';
import { RolesGuard } from 'src/common/roles.guard';
import { Roles } from 'src/common/roles.decorator';

@UseGuards(JwtCookieGuard, RolesGuard)
@Roles('admin')
@Controller('diagram')
export class DiagramController {
  constructor(private readonly diagramService: DiagramService) {}

  @Get()
  getModuleDiagram(@Res() response: Response) {
    const diagrams = this.diagramService.getModuleDiagrams();

    response.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Module Diagrams</title>
        <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
        <style>
          .diagram-container { margin: 20px; padding: 20px; border: 1px solid #eee; }
          h2 { color: #333; }
        </style>
      </head>
      <body>
        <h1>Module Dependency Diagrams</h1>
        
        <div class="diagram-container">
          <h2>Core Infrastructure</h2>
          <div class="mermaid">
            ${diagrams.core}
          </div>
        </div>
        
        <div class="diagram-container">
          <h2>Business Modules</h2>
          <div class="mermaid">
            ${diagrams.business}
          </div>
        </div>
        
        <div class="diagram-container">
          <h2>Queue/Worker Modules</h2>
          <div class="mermaid">
            ${diagrams.queues}
          </div>
        </div>
        
        <script>
          mermaid.initialize({ startOnLoad: true });
        </script>
      </body>
      </html>
    `);
  }
}
