# About Changing Slide Layout and Appearance

Mulmoscript vision is a system that creates slides using HTML templates and Tailwind CSS.
The layout and appearance of slides are designed with HTML and Tailwind classes.

## Slide Structure

Mulmoscript vision slides consist of two layers:

- **Base Template**
  - Common HTML structure for all slides
  - Composed of header (settings for styles, fonts, etc.) and body (frame for displaying slides)
- **Slide Template (Body Template)**
  - Content and layout for each individual slide
  - Over 80 types available, selectable according to purpose

## Methods to Customize Styles

In mulmoscript vision, you can freely customize the appearance and atmosphere by modifying styles with HTML and Tailwind.
There are three main customization methods:

### Method ①: Replace the Base Template

- Replace the base template file with another one
- The overall slide design (background, fonts, basic layout, etc.) changes all at once

### Method ②: Add Styles to the Base Template Header

- Add style tags or link tags within the header of the existing base template
- Change colors, font sizes, margins, etc. with Tailwind custom themes or additional CSS

### Method ③: Copy and Modify Slide Templates

- Copy the 80 types of slide templates (body parts) along with their directories
- Rewrite HTML and Tailwind classes to create custom designs
- Use the completed template set by specifying it and replacing the original template collection

## Specific Modification Methods

### Method ①: Replace the Base Template

- Base templates are located under [html/templates](./html/templates/)
- The default base template is [tailwind.html](./html/templates/tailwind.html)
- Copy this to the same directory (html/templates) to use it.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    ${headerStyle}
  </head>
  <body class="min-h-screen flex flex-col">
    ${htmlBody}
  </body>
</html>
```

- `htmlBody` is the body part of each slide (③)
- `headerStyle` is the style part that can be changed in settings (②)
- Create HTML while keeping these parts intact
- Specify the filename in the option passed to the htmlPlugin class
- Specify with `option.htmlTemplateFile`
  - TODO: specific example
  - Like "tailwind", use only the filename without extension

### Method ②: Add Styles to the Base Template Header

- Write styles referring to (1)
- Describe in text in `option.headerStyle`
  - Risk of injection

### Method ③: Copy and Modify Slide Templates

- The current default HTML templates are located under [html/html2](./html/html2/)
- Each file corresponds to functions in tools called by LLM
- Copy these HTML files and modify the HTML to apply designs. Be careful not to change the embedded variables.

- The directory name is passed as "html2" in the 4th argument of htmlPlugin
- Create directories with names like html3, fooTemplate, etc. under the html directory

### Testing Method

```
yarn run design
```
executes tests/design.ts

A directory will be created under ~/Documents/mulmocast-vision/, and 80 HTML and PNG files will be generated inside it.

```
const handler = new htmlPlugin({ outputDir, rootDir, templateOptions: { htmlTemplateFile: "tailwind-sea", headerStyle: darkStyle}, htmlDir: "html"});
```

The configuration items correspond to:
- htmlTemplateFile (1)
- headerStyle (2) 
- htmlDir (3)

You can test by changing these variables.

### output dir