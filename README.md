# extract-object-from-form-data

Utility for turning values from [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) into a JavaScript object.

## Why?

The initial motivation for this utility is to handle form submissions in Remix/React Router v7.
Instead of form submissions coming in the form of `application/json`, Remix form submissions are
sent as `FormData`. There are lots of reasons why this method of form submission is great, but
pulling the data out of the `FormData` object is not one of them, especially with large forms:

```js
const firstName = formData.get('firstName');
const lastName = formData.get('lastName');
const email = formData.get('email');

// etc. etc. etc.

const lastValue = formData.get('lastValue');
```

## Installation

```bash
$ npm install extract-object-from-form-data
```

## Importing

```js
import { extractObjectFromFormData } from 'extract-object-from-form-data';
```

## Usage

Extracting values from a simple form (like the example above):

```html
<input type="text" name="firstName" />
<input type="text" name="lastName" />
<input type="text" name="email" />
<!--  some other inputs here-->
<input type="text" name="lastValue" />
```

```js
// When handling the form submission
const formData = await request.formData();
const { firstName, lastName, email, lastValue, ...rest } = extractObjectFromFormData(formData);
```

### Nested data

You can create nested data by giving your form inputs the right names:

```html
<input type="text" name="id" />
<input type="text" name="name.first" />
<input type="text" name="name.last" />
<input type="text" name="contact.email" />
<!--  some other inputs here-->
<input type="text" name="lastValue" />
```

```js
// When handling the form submission
const formData = await request.formData();
const userData = extractObjectFromFormData(formData);

/**
  Example output
{
  id: 'user-123',
  name: {
    first: 'John',
    last: 'Lennon'
  },
  contact: {
    email: 'john@example.com'
  },
  lastValue: 'the end'
}
*/
```

### Lists

You can create lists of values:

```html
<input type="text" name="id" />
<input type="text" name="names[0]" />
<input type="text" name="name[1]" />
<input type="text" name="contact[0].email" />
<input type="text" name="contact[0].phone" />
<!--  some other inputs here-->
<input type="text" name="lastValue" />
```

```js
// When handling the form submission
const formData = await request.formData();
const userData = extractObjectFromFormData(formData);

/**
  Example output
{
  id: 'user-123',
  name: [ 'John', 'Lennon' ],
  contact: [{
    email: 'john@example.com',
    phone: '555-555-1234'
  }],
  lastValue: 'the end'
}
*/
```

### Booleans (checkboxes)

Checkboxes are difficult, because if they checkbox is not checked, then the name/value pair is not
present in the `FormData`. To make your checkboxes always show up in the output of
`extractObjectFromFormData`, you can add a `type="hidden"` Input along with the checkbox. It needs
to have the same name, plus `.isCheckbox`, then set the `value` of the checkbox input to
`isChecked` Please see the example below:

```html
<input type="checkbox" name="likesTheBeatles" value="isChecked" />
<input type="hidden" name="likesTheBeatles.isCheckbox" />
```

```js
// When handling the form submission
const formData = await request.formData();
const userData = extractObjectFromFormData(formData);

/**
  Example output if the checkbox is checked
{
  likesTheBeatles: true,
}
*/

/**

  Example output if the checkbox is not checked
{
  likesTheBeatles: false,
}
*/
```

## Contributing

PRs, bug reports, and feature requests are welcome. To get started contributing, check out the
GitHub repo, then:

```bash
$ npm install
```

To run tests (and typecheck and lint)

```bash
$ npm run typecheck && npm run lint && npm run test
```
