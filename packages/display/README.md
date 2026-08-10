# @tailor-cms/ce-table-display

End-user component for the **Table** content element in [Tailor CMS](https://github.com/tailor-cms/author).

Renders the element as learners see it in published content.

## Installation

```sh
npm install @tailor-cms/ce-table-display
```

## Usage

Content elements are normally registered with Tailor through the element
registry rather than imported directly, but the package can be consumed on its
own:

```ts
import { Display } from '@tailor-cms/ce-table-display';
```

## Element

| Property | Value |
| --- | --- |
| Name | Table |
| Type | `TABLE` |
| Icon | [`mdi-table`](https://pictogrammers.com/library/mdi/) |
| Composite | Yes |

## Packages

This element ships as four packages, published together from the
[`ce-table`](https://github.com/tailor-cms/ce-table) repository:

| Package | Role |
| --- | --- |
| [`@tailor-cms/ce-table-manifest`](https://www.npmjs.com/package/@tailor-cms/ce-table-manifest) | Shared element definition |
| [`@tailor-cms/ce-table-edit`](https://www.npmjs.com/package/@tailor-cms/ce-table-edit) | Authoring component |
| [`@tailor-cms/ce-table-display`](https://www.npmjs.com/package/@tailor-cms/ce-table-display) | End-user component |
| [`@tailor-cms/ce-table-server`](https://www.npmjs.com/package/@tailor-cms/ce-table-server) | Server-side module |

## Development

```sh
pnpm install
pnpm dev     # start the Content Element Kit runtime
pnpm build   # build all packages
pnpm test    # Playwright end-to-end suite
```

Changes are released with [changesets](https://github.com/changesets/changesets);
run `pnpm changeset` to record one.
