# erk.github.io

This repository contains a Jekyll-based personal site.

## Local Development

This project is currently set up to run with Ruby `3.3.0` via `rbenv`.

Install dependencies:

```bash
RBENV_VERSION=3.3.0 /opt/homebrew/bin/rbenv exec bundle install
```

Start the local server:

```bash
RBENV_VERSION=3.3.0 /opt/homebrew/bin/rbenv exec bundle exec jekyll serve --host 127.0.0.1 --port 4000
```

The site will be available at `http://127.0.0.1:4000/`.

## Books Section

The site includes a `Books` section for reading notes and book reflections.

### How It Works

Each book is stored as a Markdown file under [`_books/`](/Volumes/vera/dev/erk.github.io/_books).

You only need to provide:

- `layout: book`
- an `isbn` value
- your own notes in the body of the file

Book metadata such as title, author, description, page count, and cover image is fetched from Google Books and written to [`_data/books_metadata.json`](/Volumes/vera/dev/erk.github.io/_data/books_metadata.json).

### Add a New Book

Create a new file under [`_books/`](/Volumes/vera/dev/erk.github.io/_books), for example:

```md
---
layout: book
isbn: "978-0062651235"
finished_on: 2026-04-21
rating: 4
---

Write your notes here.
```

Supported ISBN input formats include:

- `9780062651235`
- `978-0062651235`
- `0062651234`

### Fetch Book Metadata

After adding or updating a book file, run:

```bash
python3 scripts/sync_books.py
```

This will:

- read all Markdown files in `_books/`
- extract the ISBN
- fetch metadata from Google Books
- update `_data/books_metadata.json`

### Build or Preview the Site

After syncing metadata, rebuild or restart the site:

```bash
RBENV_VERSION=3.3.0 /opt/homebrew/bin/rbenv exec bundle exec jekyll build
```

or:

```bash
RBENV_VERSION=3.3.0 /opt/homebrew/bin/rbenv exec bundle exec jekyll serve --host 127.0.0.1 --port 4000
```

### Notes

- If metadata is available, the `Books` page will automatically show the cover, title, author, and summary.
- If some metadata is missing, the page will still render without breaking.
- Your own commentary always lives in the Markdown body of the book file.
