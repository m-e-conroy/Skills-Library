# ARIA Roles Reference

ARIA (Accessible Rich Internet Applications) roles are categorized based on their function within a web document. The primary categories include landmark, widget, document structure, live region, window, and abstract roles.

Below is a comprehensive list of roles categorized by their purpose as defined by WAI-ARIA 1.2 and MDN Web Docs.

---

## 1. Landmark Roles

Landmark roles help users navigate to specific sections of a page quickly.

| Role | Description |
|------|-------------|
| `banner` | The site-oriented content, usually the header. |
| `complementary` | Supporting content like sidebars. |
| `contentinfo` | Metadata about the page, typically the footer. |
| `form` | A collection of form-associated elements. |
| `main` | The primary content of the document. |
| `navigation` | A collection of links for navigating the site. |
| `region` | A significant section that authors want to appear in a table of contents. |
| `search` | The search section of the page. |

---

## 2. Widget Roles

These roles describe interactive components. Some are standalone, while others are composite (containing other widgets).

### Standalone Widgets

| Role | Description |
|------|-------------|
| `button` | An input that allows for user-triggered actions. |
| `checkbox` | A checkable input. |
| `gridcell` | A cell in a grid, often focusable or editable. |
| `link` | A reference to an internal or external resource. |
| `menuitem` | An item in a set of choices. |
| `menuitemcheckbox` | A checkable menu item. |
| `menuitemradio` | A radio-style checkable menu item. |
| `option` | A selectable item in a listbox. |
| `progressbar` | Displays progress of a task. |
| `radio` | A single radio button in a group. |
| `scrollbar` | Controls the scrolling of content. |
| `searchbox` | A textbox for search queries. |
| `separator` | A focusable divider (if focusable, it is a widget). |
| `slider` | A range input. |
| `spinbutton` | A numerical input with increment/decrement controls. |
| `switch` | A toggle button. |
| `tab` | A selectable item in a tablist. |
| `tabpanel` | The container for the content associated with a tab. |
| `textbox` | An input for free-form text. |
| `treeitem` | An item in a tree structure. |

### Composite Widgets (Containers)

| Role | Description |
|------|-------------|
| `combobox` | A combined textbox and listbox. |
| `grid` | A table-like structure for interactive data. |
| `listbox` | A widget that allows users to select one or more items. |
| `menu` | A list of choices for the user. |
| `menubar` | A horizontal menu often used for application navigation. |
| `radiogroup` | A container for radio roles. |
| `tablist` | A container for tab roles. |
| `tree` | A list where items can contain sub-items. |
| `treegrid` | A grid whose rows can be expanded/collapsed like a tree. |

---

## 3. Document Structure Roles

These roles describe content organization. Most have semantic HTML equivalents that are preferred.

| Role | Description |
|------|-------------|
| `application` | A region with its own keyboard navigation (use sparingly). |
| `article` | A self-contained piece of content (like a blog post). |
| `cell` | A basic cell in a table or grid. |
| `columnheader` | A header cell for a column. |
| `definition` | A definition of a term. |
| `directory` | A list of references or members (**deprecated**). |
| `document` | Content that is intended to be read by assistive technology. |
| `feed` | A scrollable list of articles. |
| `figure` | A graphic or image with an optional caption. |
| `generic` | A container with no specific semantic meaning (like `div`). |
| `group` | A set of related objects that aren't a landmark. |
| `heading` | A title for a section. |
| `img` | An image. |
| `list` | A group of list items. |
| `listitem` | A single entry in a list. |
| `math` | A mathematical expression. |
| `meter` | A scalar measurement within a known range. |
| `none` / `presentation` | Removes the semantic meaning of an element. |
| `note` | A parenthetical or secondary piece of information. |
| `row` | A row of cells in a table or grid. |
| `rowgroup` | A group of rows (like `tbody`). |
| `rowheader` | A header cell for a row. |
| `separator` | A decorative line (if not focusable). |
| `table` | A non-interactive data table. |
| `term` | A word or phrase being defined. |
| `toolbar` | A collection of commonly used function buttons. |
| `tooltip` | A contextual popup providing information. |

### New in ARIA 1.3 (Draft)

| Role | Description |
|------|-------------|
| `comment` | A comment on a document. |
| `suggestion` | A suggested change. |
| `mark` | Highlighting for reference purposes. |

---

## 4. Live Region Roles

These notify users of dynamic content updates.

| Role | Description |
|------|-------------|
| `alert` | Important, time-sensitive information (assertive). |
| `log` | A sequential record of events (like chat history). |
| `marquee` | Information that changes frequently (like stock tickers). |
| `status` | Advisory information that is not urgent (polite). |
| `timer` | A numerical counter (like a clock). |

---

## 5. Window Roles

Define sub-windows to the main document.

| Role | Description |
|------|-------------|
| `dialog` | A dialog box or window. |
| `alertdialog` | A specialized dialog for urgent messages. |

---

## 6. Abstract Roles

> **Warning:** These are used for the internal W3C role taxonomy and **must not be used in HTML**.

`command`, `composite`, `input`, `landmark`, `range`, `roletype`, `section`, `sectionhead`, `select`, `structure`, `widget`, `window`
