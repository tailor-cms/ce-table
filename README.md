# Table

Composite table content element with editable rows, columns, and rich-text cells.

**Type:** `TABLE`

## Data

| Field | Type | Description |
|-------|------|-------------|
| `tableId` | `string` | Unique table identifier (uuid) |
| `rows` | `Record<string, Row>` | Map of rows keyed by row id; each row holds positioned cells |
| `embeds` | `Record<string, Embed>` | Map of `JODIT_HTML` cell embeds keyed by cell id |

## Edit

- Composite element: each cell is a `JODIT_HTML` embed rendered via `TailorContentElement`
- Per-cell action menu: add row before/after, add column before/after, delete row, delete column
- Minimum one row and one column enforced on delete

## Display

- Renders the table using `data.rows` and `data.embeds` content

## Development

```sh
pnpm dev     # Preview :8080 | Edit :8010 | Display :8020 | Server :8030
pnpm build
pnpm lint
pnpm test
```

## Run with Docker

```sh
docker compose up
```
