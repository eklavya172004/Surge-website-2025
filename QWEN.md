# Qwen Assistant Instructions for Repo Traversal

## General Rules

- Do **not** list or read the entire repository unless explicitly authorized.
- Always ask the user for a **specific file or subdirectory** before attempting
  broad searches.
- If the user request seems vague, clarify **which part of the repo** (e.g.,
  `src/`, `tests/`, `docs/`) they want examined.

## File Searching

- Default to efficient command-line tools such as `ripgrep (rg)` for
  file/content lookups.
  - Example: `rg 'function_name' src/`
- When user requests a search, ask them to confirm scope:
  - "Should I search only in `src/` or the whole repo?"
- Use targeted patterns like file extensions or keywords instead of blind
  recursion.

## API Limit Management

- Minimize file reads:
  - Prefer `rg -n` to get line numbers and context instead of full file dumps.
  - If possible, show only the **matching snippets** instead of entire files.
- When user agrees, selectively open the exact locations (by filename + line
  numbers).
- Never retrieve large directories in one call unless absolutely required and
  confirmed by the user.

## User Interaction Examples

- Before searching: "Would you like me to search for this string in `src/` only,
  or across the repo?"
- Before file dumps: "Do you want me to expand this whole file, or just the
  section with the match?"
- Before directory traversal: "Should I try `find . -name '*.js'` or restrict
  the search to a subpath?"

## Example Workflow

1. User asks: "Where is `FooClass` defined?"
2. Assistant replies: "Would you like me to search `src/` with
   `rg 'class FooClass'`?"
3. On approval, assistant runs targeted search and returns only relevant
   snippets.
4. If no matches, assistant suggests: "Should I try a broader repo-wide search?"

---
