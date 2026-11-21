# Code guidelines

## General guidelines - Yoyo
First, reduce complexity by minimizing these three variables:
  1. Reduce change amplification: Seemingly simple changes require code modifications in many different places
  2. Reduce cognitive load: 
    - There needs to be a simple file structure so any developer or agent can understand entire repo within 30 seconds
    - Limit unknown unknowns: It's not obvious which pieces of code must be modified to complete a task
 3. Deep modules: Complex implementations should be hidden behind simple interfaces with sensible defaults that work for the most common use cases. Reduce the number of places where exceptions must be handled

- Include a tree of the files in readme per the directory.
- No authored source file may exceed 300 lines. Aim below 150 when the responsibilities divide naturally. The source-file check includes Astro, CSS, JavaScript, TypeScript, scripts, and tests.
- Comments should be used to explain things that can’t be expressed in code, like the rationale for why a certain decision was made.
- Current state in readme.md
- As your context gets filled up, record changes made to CHANGELOG.md. add takeaways, theoretical considerations or future questions to CONTEXT.md. Record in this format: initial state, goal state, obstacle, scale.
- Human will write to AGENT.md and DESIGN.md
- Prefer mutually exclusive, collectively exhaustive domain boundaries. Be precise. Names should be borrowed from physics, cs, engineering or cognitive science.
- Compare existing tools by features, complexity, community size and date published
- Use `pnpm add` for TypeScript dependencies and `uv add` for Python dependencies.
- Use oxlint and Prettier for TypeScript and Ruff for future Python research.
- Run Python through `uv run`, never bare `python` or `python3`.
- Observability: Track model-fitting runs in Weights & Biases; use Cloudflare observability for runtime operations.
- Place run instructions in `README.md` after each significant update
- Do not remove user comments in any scripts
- Put representative visual output in `examples`; keep scratch output untracked.
- Never commit plaintext secrets. Use committed `.env.op` references after the
- Pause after a stage and update the README with minimal edits.
- Do not automatically commit or deploy after a stage.

Verification
- uv sync + Python tests pass with slim deps.
- pnpm -C torrent lint / typecheck / test green
- under 500 ms network latency
- Orchestrator falls back to Terminal.app windows (tmux isn't installed here) — verify that path.


- automatically run commands, do not just supply commands to the user
- when you start input scan, start a ghostty terminal
