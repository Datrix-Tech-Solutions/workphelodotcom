# Product page images

Each section of a product page reads its slideshow from its own folder:

    public/products/<page slug>/<section id>/

Drop `.png`, `.jpg`, `.jpeg`, `.webp` or `.avif` files in a folder and they appear
as slides, in filename order (`1.png`, `2.png`, ...). No code change is needed.
A section with no images shows an icon panel instead.

| Page (slug)          | Section folders                                                  |
| -------------------- | ---------------------------------------------------------------- |
| `hrm`                | `employee-management`, `recruitment`, `payroll`, `projects`, `asset-management` |
| `marketing`          | `campaign-management`, `prospecting`, `fleet-management`         |
| `accounting`         | `entries`, `budgets`, `payroll-link`                             |
| `company-operations` | `operations`                                                     |

Screenshots are shown at about 2000 x 1190 (roughly 5:3); other shapes are cropped to fit.
