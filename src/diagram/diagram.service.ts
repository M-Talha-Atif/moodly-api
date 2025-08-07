import { Injectable } from '@nestjs/common';
import { SpelunkerModule } from 'nestjs-spelunker';
import { INestApplication } from '@nestjs/common';

@Injectable()
export class DiagramService {
  private app: INestApplication;

  // Method to set the Nest application instance
  setApp(app: INestApplication) {
    this.app = app;
  }

  getModuleDiagrams() {
    if (!this.app) {
      throw new Error('Nest application instance not set.');
    }
    return this.generateModuleGraph(this.app);
  }

  private generateModuleGraph(app: INestApplication) {
    const graph = SpelunkerModule.explore(app);
    const root = SpelunkerModule.graph(graph);
    const edges = SpelunkerModule.findGraphEdges(root);

    const categorizeModules = (edges) => {
      const coreModules = new Set([
        'ConfigModule',
        'ConfigHostModule',
        'TypeOrmModule',
        'TypeOrmCoreModule',
        'MongooseModule',
        'MongooseCoreModule',
      ]);
      const queueModules = new Set([
        'BullModule',
        'RedisModule',
        'MoodLogQueueModule',
      ]);

      return {
        core: edges.filter(
          ({ from, to }) =>
            coreModules.has(from.module.name) ||
            coreModules.has(to.module.name),
        ),
        business: edges.filter(
          ({ from, to }) =>
            !coreModules.has(from.module.name) &&
            !queueModules.has(from.module.name) &&
            !coreModules.has(to.module.name) &&
            !queueModules.has(to.module.name),
        ),
        queues: edges.filter(
          ({ from, to }) =>
            queueModules.has(from.module.name) ||
            queueModules.has(to.module.name),
        ),
      };
    };

    const { core, business, queues } = categorizeModules(edges);

    return {
      core: this.generateMermaidDiagram(
        core.map((e) => ({ from: e.from.module.name, to: e.to.module.name })),
      ),
      business: this.generateMermaidDiagram(
        business.map((e) => ({
          from: e.from.module.name,
          to: e.to.module.name,
        })),
      ),
      queues: this.generateMermaidDiagram(
        queues.map((e) => ({ from: e.from.module.name, to: e.to.module.name })),
      ),
    };
  }

  private generateMermaidDiagram(graphData: { from: string; to: string }[]) {
    return `graph TD\n${graphData.map((e) => `${e.from}-->${e.to}`).join('\n')}`;
  }
}
