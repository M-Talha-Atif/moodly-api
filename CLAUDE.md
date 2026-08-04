# CLAUDE.md

@AGENTS.md

The instructions above apply to Claude Code the same as any other agent working in this repo. A few notes specific to working with Claude in this project:

- Prefer the `Read`/`Grep`/`Glob` tools over `Bash` for exploring code, this repo is large enough that targeted reads are faster than shelling out.
- When a change touches more than one module, check whether it also needs a Mermaid diagram or a table updated in the root `README.md`, diagrams here are hand-written, not generated, and drift silently if left alone.
- If you add or change a Mermaid diagram, keep node and subgraph identifiers distinct from each other, avoid literal `\n` inside message text (use `<br/>` instead), and avoid special characters like `@` or unescaped parentheses in edge labels. GitHub's renderer is stricter than the Mermaid live editor and will fail silently on constructs that look fine elsewhere.
- Never use the em dash character (—) in anything you write in this repo: code, comments, commit messages, or docs.
