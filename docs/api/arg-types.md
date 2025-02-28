---
title: 'ArgTypes'
---

ArgTypes specify the behavior of [args](../writing-stories/args.md). By specifying the type of an arg, you constrain the values that it can accept and provide information about args that are not explicitly set (i.e., [description](#description)).

You can also use argTypes to “annotate” args with information used by addons that make use of those args. For instance, to instruct the [controls addon](../essentials/controls.md) to render a color picker, you could specify the `'color'` [control type](#control).

The most concrete realization of argTypes is the [`ArgTypes` doc block](./doc-block-argtypes.md) ([`Controls`](./doc-block-controls.md) is similar). Each row in the table corresponds to a single argType and the current value of that arg.

![ArgTypes table](./doc-block-argtypes.png)

## Automatic argType inference

If you are using the Storybook [docs](../writing-docs/introduction.md) addon (installed by default as part of [essentials](../essentials/introduction.md)), then Storybook will infer a set of argTypes for each story based on the `component` specified in the [default export](../writing-stories/introduction#default-export) of the CSF file.

To do so, Storybook uses various static analysis tools depending on your framework.

| Framework     | Static analysis tool                                                                                                                          |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| React         | [react-docgen](https://github.com/reactjs/react-docgen) or [react-docgen-typescript](https://github.com/styleguidist/react-docgen-typescript) |
| Vue           | [vue-docgen-api](https://github.com/vue-styleguidist/vue-styleguidist/tree/dev/packages/vue-docgen-api)                                       |
| Angular       | [compodoc](https://compodoc.app/)                                                                                                             |
| WebComponents | [custom-element.json](https://github.com/webcomponents/custom-elements-json)                                                                  |
| Ember         | [YUI doc](https://github.com/ember-learn/ember-cli-addon-docs-yuidoc#documenting-components)                                                  |

The data structure of `argTypes` is designed to match the output of the these tools. Properties specified manually will override what is inferred.

## Manually specifying argTypes

For most Storybook projects, argTypes are [automatically inferred](#automatic-argtype-inference) from your components. Any argTypes specified manually will override the inferred values.

ArgTypes are most often specified at the meta (component) level, in the [default export](../writing-stories/introduction#default-export) of the CSF file:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'angular/arg-types-in-meta.ts.mdx',
    'web-components/arg-types-in-meta.js.mdx',
    'web-components/arg-types-in-meta.ts.mdx',
    'common/arg-types-in-meta.js.mdx',
    'common/arg-types-in-meta.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

They can apply to all stories when specified at the project (global) level, in the `preview.js|ts` configuration file:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/arg-types-in-preview.js.mdx',
    'common/arg-types-in-preview.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

Or they can apply only to a [specific story](../writing-stories/introduction#defining-stories):

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'angular/arg-types-in-story.ts.mdx',
    'web-components/arg-types-in-story.js.mdx',
    'web-components/arg-types-in-story.ts.mdx',
    'common/arg-types-in-story.js.mdx',
    'common/arg-types-in-story.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

## `argTypes`

Type:

```ts
{
  [key: string]: {
    control?: ControlType | { type: ControlType; /* See below for more */ };
    description?: string;
    if?: Conditional;
    mapping?: { [key: string]: { [option: string]: any } };
    name?: string;
    options?: string[];
    table?: {
      category?: string;
      defaultValue?: { summary: string; detail?: string };
      subcategory?: string;
      type?: { summary?: string; detail?: string };
    },
    type?: SBType | SBScalarType['name'];
  }
}
```

You configure argTypes using an object with keys matching the name of args. The value of each key is an object with the following properties:

### `control`

Type:

```ts
| ControlType
| {
    type: ControlType,
    accept?: string;
    labels?: { [option: string]: string };
    max?: number;
    min?: number;
    presetColors?: string[];
    step?: number;
  }
```

Default:

1. `'select'`, if [`options`](#options) are specified
2. Else, inferred from [`type`](#type)
3. Else, `'object'`

Specify the behavior of the [controls addon](../essentials/controls.md) for the arg. If you specify a string, it's used as the [`type`](#controltype) of the control. If you specify an object, you can provide additional configuration.

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'angular/arg-types-control.ts.mdx',
    'web-components/arg-types-control.js.mdx',
    'web-components/arg-types-control.ts.mdx',
    'common/arg-types-control.js.mdx',
    'common/arg-types-control.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

#### `control.type`

Type: `ControlType | null`

Default: [Inferred](#automatic-argtype-inference); `'select'`, if [`options`](#options) are specified; falling back to `'object'`

Specifies the type of control used to change the arg value with the [controls addon](../essentials/controls.md). Here are the available types, `ControlType`, grouped by the type of data they handle:

| Data&nbsp;type | ControlType      | Description                                                                                                                                                                            |
| -------------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **array**      | `'object'`       | Provides a JSON-based editor to handle the values of the array. Also allows editing in raw mode.<br/> `{ control: 'object' }`                                                          |
| **boolean**    | `'boolean'`      | Provides a toggle for switching between possible states.<br/> `{ control: 'boolean' }`                                                                                                 |
| **enum**       | `'check'`        | Provides a set of stacked checkboxes for selecting multiple options.<br/> `{ control: 'check', options: ['email', 'phone', 'mail'] }`                                                  |
|                | `'inline-check'` | Provides a set of inlined checkboxes for selecting multiple options.<br/> `{ control: 'inline-check', options: ['email', 'phone', 'mail'] }`                                           |
|                | `'radio'`        | Provides a set of stacked radio buttons based on the available options.<br/> `{ control: 'radio', options: ['email', 'phone', 'mail'] }`                                               |
|                | `'inline-radio'` | Provides a set of inlined radio buttons based on the available options.<br/> `{ control: 'inline-radio', options: ['email', 'phone', 'mail'] }`                                        |
|                | `'select'`       | Provides a select to choose a single value from the options.<br/> `{ control: 'select', options: [20, 30, 40, 50] }`                                                                   |
|                | `'multi-select'` | Provides a select to choose multiple values from the options.<br/> `{ control: 'multi-select', options: ['USA', 'Canada', 'Mexico'] }`                                                 |
| **number**     | `'number'`       | Provides a numeric input to include the range of all possible values.<br/> `{ control: { type: 'number', min:1, max:30, step: 2 } }`                                                   |
|                | `'range'`        | Provides a range slider to include all possible values.<br/> `{ control: { type: 'range', min: 1, max: 30, step: 3 } }`                                                                |
| **object**     | `'file'`         | Provides a file input that returns an array of URLs. Can be further customized to accept specific file types.<br/> `{ control: { type: 'file', accept: '.png' } }`                     |
|                | `'object'`       | Provides a JSON-based editor to handle the object's values. Also allows editing in raw mode.<br/> `{ control: 'object' }`                                                              |
| **string**     | `'color'`        | Provides a color picker to choose color values. Can be additionally configured to include a set of color presets.<br/> `{ control: { type: 'color', presetColors: ['red', 'green']} }` |
|                | `'date'`         | Provides a datepicker to choose a date.<br /> `{ control: 'date' }`                                                                                                                    |
|                | `'text'`         | Provides a freeform text input.<br/> `{ control: 'text' }`                                                                                                                             |

<div class="aside">

💡 The `date` control will convert the date into a UNIX timestamp when the value changes. It's a known limitation that will be fixed in a future release. If you need to represent the actual date, you'll need to update the story's implementation and convert the value into a date object.

</div>

#### `control.accept`

Type: `string`

When `type` is `'file'`, you can specify the file types that are accepted. The value should be a string of comma-separated MIME types.

#### `control.labels`

Type: `{ [option: string]: string }`

Map [`options`](#options) to labels. `labels` doesn't have to be exhaustive. If an option is not in the object's keys, it's used verbatim.

#### `control.max`

Type: `number`

When `type` is `'number'` or `'range'`, sets the maximum allowed value.

#### `control.min`

Type: `number`

When `type` is `'number'` or `'range'`, sets the minimum allowed value.

#### `control.presetColors`

Type: `string[]`

When `type` is `'color'`, defines the set of colors that are available in addition to the general color picker. The values in the array should be valid CSS color values.

#### `control.step`

Type: `number`

When `type` is `'number'` or `'range'`, sets the granularity allowed when incrementing/decrementing the value.

### `description`

Type: `string`

Default: [Inferred](#automatic-argtype-inference)

Describe the arg. (If you intend to describe the type of the arg, you should use [`table.type`](#tabletype), instead.)

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'angular/arg-types-description.ts.mdx',
    'web-components/arg-types-description.js.mdx',
    'web-components/arg-types-description.ts.mdx',
    'common/arg-types-description.js.mdx',
    'common/arg-types-description.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

### `if`

Type:

```ts
{
  [predicateType: 'arg' | 'global']: string;
  eq?: any;
  exists?: boolean;
  neq?: any;
  truthy?: boolean;
}
```

Conditionally render an argType based on the value of another [arg](../writing-stories/args.md) or [global](../essentials/toolbars-and-globals.md).

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'angular/arg-types-if.ts.mdx',
    'web-components/arg-types-if.js.mdx',
    'web-components/arg-types-if.ts.mdx',
    'common/arg-types-if.js.mdx',
    'common/arg-types-if.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

### `mapping`

Type: `{ [key: string]: { [option: string]: any } }`

Map [`options`](#options) to values.

When dealing with non-primitive values, you'll notice that you'll run into some limitations. The most obvious issue is that not every value can be represented as part of the `args` param in the URL, losing the ability to share and deeplink to such a state. Beyond that, complex values such as JSX cannot be synchronized between the manager (e.g., Controls addon) and the preview (your story).

`mapping` doesn't have to be exhaustive. If the currently selected option is not listed, it's used verbatim. Can be used with [`control.labels`](#labels).

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'angular/arg-types-mapping.ts.mdx',
    'web-components/arg-types-mapping.js.mdx',
    'web-components/arg-types-mapping.ts.mdx',
    'common/arg-types-mapping.js.mdx',
    'common/arg-types-mapping.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

### `name`

Type: `string`

The `argTypes` object uses the name of the arg as the key. By default, that key is used when displaying the argType in Storybook. You can override the displayed name by specifying a `name` property.

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'angular/arg-types-name.ts.mdx',
    'web-components/arg-types-name.js.mdx',
    'web-components/arg-types-name.ts.mdx',
    'common/arg-types-name.js.mdx',
    'common/arg-types-name.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

<div class="aside">

💡 Be careful renaming args in this way. Users of the component you're documenting will not be able to use the documented name as a property of your component and the actual name will not displayed.

For this reason, the `name` property is best used when defining an `argType` that is only used for documentation purposes and not an actual property of the component. For example, when [providing argTypes for each property of an object](https://stackblitz.com/edit/github-uplqzp?file=src/stories/Button.stories.tsx).

</div>

### `options`

Type: `string[]`

Default: [Inferred](#automatic-argtype-inference)

If the arg accepts a finite set of values, you can specify them with `options`. If those values are [complex](../essentials/controls#dealing-with-complex-values), like JSX elements, you can use [`mapping`](#mapping) to map them to string values. You can use [`control.labels`](#labels) to provide custom labels for the options.

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'angular/arg-types-options.ts.mdx',
    'web-components/arg-types-options.js.mdx',
    'web-components/arg-types-options.ts.mdx',
    'common/arg-types-options.js.mdx',
    'common/arg-types-options.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

### `table`

Type:

```ts
{
  category?: string;
  defaultValue?: {
    detail?: string;
    summary: string;
  };
  subcategory?: string;
  type?: {
    detail?: string;
    summary: string;
  };
}
```

Default: [Inferred](#automatic-argtype-inference)

Specify how the arg is documented in the [`ArgTypes` doc block](./doc-block-argtypes.md), [`Controls` doc block](./doc-block-controls.md), and [Controls addon panel](../essentials/controls.md).

<!-- prettier-ignore-start -->

 <CodeSnippets
  paths={[
    'angular/arg-types-table.ts.mdx',
    'web-components/arg-types-table.js.mdx',
    'web-components/arg-types-table.ts.mdx',
    'common/arg-types-table.js.mdx',
    'common/arg-types-table.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

#### `table.category`

Type: `string`

Default: [Inferred](#automatic-argtype-inference), in some frameworks

Display the argType under a category heading, with the label specified by `category`.

#### `table.defaultValue`

Type: `{ detail?: string; summary: string }`

Default: [Inferred](#automatic-argtype-inference)

The documented default value of the argType. `summary` is typically used for the value itself, while `detail` is used for additional information.

#### `table.subcategory`

Type: `string`

Display the argType under a subcategory heading (which displays under the [`category`] heading), with the label specified by `subcategory`.

#### `table.type`

Type: `{ detail?: string; summary: string }`

Default: Inferred from [`type`](#type)

The documented type of the argType. `summary` is typically used for the type itself, while `detail` is used for additional information.

If you need to specify the actual, semantic type, you should use [`type`](#type), instead.

### `type`

Type: `'boolean' | 'function' | 'number' | 'string' | 'symbol' | SBType`

The full type of `SBType` is:

<details>
<summary>SBType</summary>

```ts
interface SBBaseType {
  required?: boolean;
  raw?: string;
}

type SBScalarType = SBBaseType & {
  name: 'boolean' | 'string' | 'number' | 'function' | 'symbol';
};

type SBArrayType = SBBaseType & {
  name: 'array';
  value: SBType;
};
type SBObjectType = SBBaseType & {
  name: 'object';
  value: Record<string, SBType>;
};
type SBEnumType = SBBaseType & {
  name: 'enum';
  value: (string | number)[];
};
type SBIntersectionType = SBBaseType & {
  name: 'intersection';
  value: SBType[];
};
type SBUnionType = SBBaseType & {
  name: 'union';
  value: SBType[];
};
type SBOtherType = SBBaseType & {
  name: 'other';
  value: string;
};

type SBType =
  | SBScalarType
  | SBEnumType
  | SBArrayType
  | SBObjectType
  | SBIntersectionType
  | SBUnionType
  | SBOtherType;
```

</details>

Default: [Inferred](#automatic-argtype-inference)

Specifies the semantic type of the argType. When an argType is [inferred](#automatic-argtype-inference), the information from the various tools is summarized in this property, which is then used to infer other properties, like [`control`](#control) and [`table.type`](#tabletype).

If you only need to specify the documented type, you should use [`table.type`](#tabletype), instead.

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'angular/arg-types-type.ts.mdx',
    'web-components/arg-types-type.js.mdx',
    'web-components/arg-types-type.ts.mdx',
    'common/arg-types-type.js.mdx',
    'common/arg-types-type.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

### `defaultValue` (deprecated)

Type: `any`

Define the default value of the argType. Deprecated in favor of defining the [`arg`](../writing-stories/args.md) value directly.

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'angular/arg-types-default-value.ts.mdx',
    'web-components/arg-types-default-value.js.mdx',
    'web-components/arg-types-default-value.ts.mdx',
    'common/arg-types-default-value.js.mdx',
    'common/arg-types-default-value.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->
