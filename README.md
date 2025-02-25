# QRScout

A QR Code-based scouting system for FRC, forked from https://github.com/frc2713/QRScout.

## Getting started

QRScout is a web app. To open it, all 3you have to do is visit https://frc2713.github.io/QRScout/

QRScout takes in form data inputed durring a FRC match about the robots playing it, and outputs a QR code with all of that data, in a list seperated by default by tabs. The QR code generated can then be scanned and inputted into something like a Microsoft Excel or Google Sheets spreadsheet, and analyzed.

## Using QRScout

When you visit QRScout, you're shown a screen that looks something like
![The QRScout homepage](src/assets/images/main_screen.png)
At the top, and taking up most of the page, are form fields. These are the input for the data that will later be made into a QRCode.

Some of these fields are required, and others aren't. QRScout will refuse to let you submit the form until all of the required fields are filled out.

![The bottom of the QRScout homepage](src/assets/images/main_screen_bottom.png)
Down at the bottom of the page, there are the Commit and Reset Form buttons. The Commit button will generate a QR code of the form data that you filled out above, and display this onscreen to be scanned, alongside the text that is encoded in the QR code. The Reset Form button resets most of the form fields, so that it can be used again without havng to reload the page. It does not reset most of the Prematch column, as most of this data can be reused from match to match.

There are also the Copy Column Names and Edit Config buttons. Clicking Copy Column Names will do what it suggests, and copy the names of each column to your clipboard. The Edit Config button leads you to the `config.json` editor. The three buttons beneath this are used to change from light to dark mode, and set the page to your system theme (the default).

> The line delimiter in the text alongside the QRCode is always a comma, regardless of what it set to. In the data in the QRCode and is optionally copied to your clipboard, it will be what you have set it to.

Clicking on Edit Config leads you to the following screen:
![The config editor](src/assets/images/editor_screen.png)
The text editor allows you to edit the `config.json` file (see below). Click the Save button to save any changes you make.

Once you create a custom `config.json` file for your team, there are 2 ways to leverage it in competition:
1. Download the custom `config.json` file to each tablet / device for your scouts and upload it to QRScout using the "Upload Config" button in the options menu.
2. Host the custom `config.json` file in a public GitHub repository and load it into QRScout using the "Load from URL" button in the settings menu.

You can also download the config.json file to your device and reset the config.json to the default.
![Editor options menu](src/assets/images/editor_options.png)

### Hosting a custom JSON config for your team

To host your JSON config in a GitHub repository and make it available publicly via GitHub Pages, follow these steps:

1. Create a new repository on GitHub or use an existing one.
2. Add your JSON config file to the repository.
3. Enable GitHub Pages for the repository:
   - Go to the repository's "Settings" tab.
   - Scroll down to the "GitHub Pages" section.
   - Select the branch you want to use for GitHub Pages (e.g., `main`).
   - Click "Save".
4. After enabling GitHub Pages, your JSON config file will be available at a URL like `https://<username>.github.io/<repository>/<path-to-config>.json`.

You can now use this URL to load the JSON config in QRScout.

## config.json

The config.json file is what configures the form fields for QRScout, the page title, the title at the top of your screen, and the line delimiter used in the QRCode.

The config.json can be edited to change most parts of QRScout, and change the line delimiter character used by the QRCode.

The basic structure of the config.json file is as follows:

### Root:

`$schema`: A reference to the schema used by the config.json file. This shouldn't be changed from the default "../schema.json".

`title`: The title of the page. This is what appears in the tab bar.

`page_title`: The title that appears at the top of the QRScout page.

`delimiter`: The line delimiter used by the QR code

`sections`: An array of sections/columns that hold and organize form inputs

### Individual sections:

`name`: The name of the section/column

`fields`: An array of fields, which describe form inputs.

### Individual fields:

`title`: The name of this field

`type`: One of "text", "number", "boolean", "range", "select", "counter", "image" or "timer". Describes the type of input this is.

`required`: a boolean indicating if this must be filled out before the QRCode is generated. If any field with this set to true is not filled out, QRScout will not generate a QRCode when the commit button is pressed.

`code`: camelCase string with a unique name indicaing what this field is.

`disabled`: Boolean indicating if this field is disabled. If it is, things cannot be inputted into it. This and the requied value are mutually exclusive if you want people to be able to submit this form.

`formResetBehavior`: One of "reset", "preserve", or "increment".

- `reset` will reset the field whenver the form resets
- `preserve` will retain the current value
- `increment` will increment the value based on the field's settings

`choices`: An object containng numbered keys mapping to values that this can hold. For example:

```json
"choices": {
    "1": "First option",
    "2": "Second option"
}
```

`defaultValue`: The default value of this field.
