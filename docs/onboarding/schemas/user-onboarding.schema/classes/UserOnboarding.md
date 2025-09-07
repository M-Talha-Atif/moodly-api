[**ai-moodler-backend v0.0.1**](../../../../README.md)

---

[ai-moodler-backend](../../../../README.md) / [onboarding/schemas/user-onboarding.schema](../README.md) / UserOnboarding

# Class: UserOnboarding

Defined in: [src/onboarding/schemas/user-onboarding.schema.ts:6](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/onboarding/schemas/user-onboarding.schema.ts#L6)

## Extends

- `Document`

## Constructors

### Constructor

> **new UserOnboarding**(`doc?`): `UserOnboarding`

Defined in: node_modules/mongoose/types/document.d.ts:22

#### Parameters

##### doc?

`any`

#### Returns

`UserOnboarding`

#### Inherited from

`Document.constructor`

## Properties

### \_id

> **\_id**: `unknown`

Defined in: node_modules/mongoose/types/document.d.ts:25

This documents \_id.

#### Inherited from

`Document._id`

---

### $locals

> **$locals**: `Record`\<`string`, `unknown`\>

Defined in: node_modules/mongoose/types/document.d.ts:79

Empty object that you can use for storing properties on the document. This
is handy for passing data to middleware without conflicting with Mongoose
internals.

#### Inherited from

[`CommunityEmbedding`](../../../../embedding/schemas/community-embedding.schema/classes/CommunityEmbedding.md).[`$locals`](../../../../embedding/schemas/community-embedding.schema/classes/CommunityEmbedding.md#locals)

---

### $op

> **$op**: `null` \| `"remove"` \| `"save"` \| `"validate"`

Defined in: node_modules/mongoose/types/document.d.ts:92

A string containing the current operation that Mongoose is executing
on this document. Can be `null`, `'save'`, `'validate'`, or `'remove'`.

#### Inherited from

[`CommunityEmbedding`](../../../../embedding/schemas/community-embedding.schema/classes/CommunityEmbedding.md).[`$op`](../../../../embedding/schemas/community-embedding.schema/classes/CommunityEmbedding.md#op)

---

### $where

> **$where**: `Record`\<`string`, `unknown`\>

Defined in: node_modules/mongoose/types/document.d.ts:114

Set this property to add additional query filters when Mongoose saves this document and `isNew` is false.

#### Inherited from

[`CommunityEmbedding`](../../../../embedding/schemas/community-embedding.schema/classes/CommunityEmbedding.md).[`$where`](../../../../embedding/schemas/community-embedding.schema/classes/CommunityEmbedding.md#where)

---

### activities

> **activities**: `string`[]

Defined in: [src/onboarding/schemas/user-onboarding.schema.ts:25](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/onboarding/schemas/user-onboarding.schema.ts#L25)

---

### baseModelName?

> `optional` **baseModelName**: `string`

Defined in: node_modules/mongoose/types/document.d.ts:117

If this is a discriminator model, `baseModelName` is the name of the base model.

#### Inherited from

[`CommunityEmbedding`](../../../../embedding/schemas/community-embedding.schema/classes/CommunityEmbedding.md).[`baseModelName`](../../../../embedding/schemas/community-embedding.schema/classes/CommunityEmbedding.md#basemodelname)

---

### collection

> **collection**: `Collection`

Defined in: node_modules/mongoose/types/document.d.ts:120

Collection the model uses.

#### Inherited from

[`CommunityEmbedding`](../../../../embedding/schemas/community-embedding.schema/classes/CommunityEmbedding.md).[`collection`](../../../../embedding/schemas/community-embedding.schema/classes/CommunityEmbedding.md#collection)

---

### completed

> **completed**: `boolean`

Defined in: [src/onboarding/schemas/user-onboarding.schema.ts:32](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/onboarding/schemas/user-onboarding.schema.ts#L32)

---

### currentStep

> **currentStep**: `number`

Defined in: [src/onboarding/schemas/user-onboarding.schema.ts:29](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/onboarding/schemas/user-onboarding.schema.ts#L29)

---

### db

> **db**: `Connection`

Defined in: node_modules/mongoose/types/document.d.ts:123

Connection the model uses.

#### Inherited from

[`CommunityEmbedding`](../../../../embedding/schemas/community-embedding.schema/classes/CommunityEmbedding.md).[`db`](../../../../embedding/schemas/community-embedding.schema/classes/CommunityEmbedding.md#db)

---

### errors?

> `optional` **errors**: `ValidationError`

Defined in: node_modules/mongoose/types/document.d.ts:157

Returns the current validation errors.

#### Inherited from

[`CommunityEmbedding`](../../../../embedding/schemas/community-embedding.schema/classes/CommunityEmbedding.md).[`errors`](../../../../embedding/schemas/community-embedding.schema/classes/CommunityEmbedding.md#errors)

---

### goals

> **goals**: `string`[]

Defined in: [src/onboarding/schemas/user-onboarding.schema.ts:21](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/onboarding/schemas/user-onboarding.schema.ts#L21)

---

### id?

> `optional` **id**: `any`

Defined in: node_modules/mongoose/types/document.d.ts:170

The string version of this documents \_id.

#### Inherited from

[`CommunityEmbedding`](../../../../embedding/schemas/community-embedding.schema/classes/CommunityEmbedding.md).[`id`](../../../../embedding/schemas/community-embedding.schema/classes/CommunityEmbedding.md#id)

---

### isNew

> **isNew**: `boolean`

Defined in: node_modules/mongoose/types/document.d.ts:206

Boolean flag specifying if the document is new.

#### Inherited from

[`CommunityEmbedding`](../../../../embedding/schemas/community-embedding.schema/classes/CommunityEmbedding.md).[`isNew`](../../../../embedding/schemas/community-embedding.schema/classes/CommunityEmbedding.md#isnew)

---

### responses

> **responses**: `object`[]

Defined in: [src/onboarding/schemas/user-onboarding.schema.ts:17](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/onboarding/schemas/user-onboarding.schema.ts#L17)

#### answer

> **answer**: `string`

#### question

> **question**: `string`

---

### schema

> **schema**: `Schema`

Defined in: node_modules/mongoose/types/document.d.ts:250

The document's schema.

#### Inherited from

`Document.schema`

---

### userId

> **userId**: `string`

Defined in: [src/onboarding/schemas/user-onboarding.schema.ts:8](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/onboarding/schemas/user-onboarding.schema.ts#L8)

## Methods

### $assertPopulated()

> **$assertPopulated**\<`Paths`\>(`path`, `values?`): `Omit`\<`UserOnboarding`, keyof `Paths`\> & `Paths`

Defined in: node_modules/mongoose/types/document.d.ts:28

Assert that a given path or paths is populated. Throws an error if not populated.

#### Type Parameters

##### Paths

`Paths` = \{ \}

#### Parameters

##### path

`string` | `string`[]

##### values?

`Partial`\<`Paths`\>

#### Returns

`Omit`\<`UserOnboarding`, keyof `Paths`\> & `Paths`

#### Inherited from

`Document.$assertPopulated`

---

### $clearModifiedPaths()

> **$clearModifiedPaths**(): `this`

Defined in: node_modules/mongoose/types/document.d.ts:31

Clear the document's modified paths.

#### Returns

`this`

#### Inherited from

`Document.$clearModifiedPaths`

---

### $clone()

> **$clone**(): `this`

Defined in: node_modules/mongoose/types/document.d.ts:34

Returns a deep clone of this document

#### Returns

`this`

#### Inherited from

`Document.$clone`

---

### $createModifiedPathsSnapshot()

> **$createModifiedPathsSnapshot**(): `ModifiedPathsSnapshot`

Defined in: node_modules/mongoose/types/document.d.ts:40

Creates a snapshot of this document's internal change tracking state. You can later
reset this document's change tracking state using `$restoreModifiedPathsSnapshot()`.

#### Returns

`ModifiedPathsSnapshot`

#### Inherited from

`Document.$createModifiedPathsSnapshot`

---

### $getAllSubdocs()

> **$getAllSubdocs**(): `Document`\<`unknown`, `any`, `any`, `Record`\<`string`, `any`\>, \{ \}\>[]

Defined in: node_modules/mongoose/types/document.d.ts:43

#### Returns

`Document`\<`unknown`, `any`, `any`, `Record`\<`string`, `any`\>, \{ \}\>[]

#### Inherited from

`Document.$getAllSubdocs`

---

### $getPopulatedDocs()

> **$getPopulatedDocs**(): `Document`\<`unknown`, `any`, `any`, `Record`\<`string`, `any`\>, \{ \}\>[]

Defined in: node_modules/mongoose/types/document.d.ts:55

Returns an array of all populated documents associated with the query

#### Returns

`Document`\<`unknown`, `any`, `any`, `Record`\<`string`, `any`\>, \{ \}\>[]

#### Inherited from

`Document.$getPopulatedDocs`

---

### $ignore()

> **$ignore**(`path`): `void`

Defined in: node_modules/mongoose/types/document.d.ts:46

Don't run validation on this path or persist changes to this path.

#### Parameters

##### path

`string`

#### Returns

`void`

#### Inherited from

`Document.$ignore`

---

### $inc()

> **$inc**(`path`, `val?`): `this`

Defined in: node_modules/mongoose/types/document.d.ts:62

Increments the numeric value at `path` by the given `val`.
When you call `save()` on this document, Mongoose will send a
`$inc` as opposed to a `$set`.

#### Parameters

##### path

`string` | `string`[]

##### val?

`number`

#### Returns

`this`

#### Inherited from

`Document.$inc`

---

### $isDefault()

> **$isDefault**(`path?`): `boolean`

Defined in: node_modules/mongoose/types/document.d.ts:49

Checks if a path is set to its default. If no path set, checks if any path is set to its default.

#### Parameters

##### path?

`string`

#### Returns

`boolean`

#### Inherited from

`Document.$isDefault`

---

### $isDeleted()

> **$isDeleted**(`val?`): `boolean`

Defined in: node_modules/mongoose/types/document.d.ts:52

Getter/setter, determines whether the document was removed or not.

#### Parameters

##### val?

`boolean`

#### Returns

`boolean`

#### Inherited from

`Document.$isDeleted`

---

### $isEmpty()

> **$isEmpty**(`path`): `boolean`

Defined in: node_modules/mongoose/types/document.d.ts:69

Returns true if the given path is nullish or only contains empty objects.
Useful for determining whether this subdoc will get stripped out by the
[minimize option](/docs/guide.html#minimize).

#### Parameters

##### path

`string`

#### Returns

`boolean`

#### Inherited from

`Document.$isEmpty`

---

### $isValid()

> **$isValid**(`path`): `boolean`

Defined in: node_modules/mongoose/types/document.d.ts:72

Checks if a path is invalid

#### Parameters

##### path

`string`

#### Returns

`boolean`

#### Inherited from

`Document.$isValid`

---

### $markValid()

> **$markValid**(`path`): `void`

Defined in: node_modules/mongoose/types/document.d.ts:82

Marks a path as valid, removing existing validation errors.

#### Parameters

##### path

`string`

#### Returns

`void`

#### Inherited from

`Document.$markValid`

---

### $model()

#### Call Signature

> **$model**\<`ModelType`\>(`name`): `ModelType`

Defined in: node_modules/mongoose/types/document.d.ts:85

Returns the model with the given name on this document's associated connection.

##### Type Parameters

###### ModelType

`ModelType` = `Model`\<`unknown`, \{ \}, \{ \}, \{ \}, `Document`\<`unknown`, \{ \}, `unknown`, \{ \}, \{ \}\> & `object` & `object`, `any`\>

##### Parameters

###### name

`string`

##### Returns

`ModelType`

##### Inherited from

`Document.$model`

#### Call Signature

> **$model**\<`ModelType`\>(): `ModelType`

Defined in: node_modules/mongoose/types/document.d.ts:86

Returns the model with the given name on this document's associated connection.

##### Type Parameters

###### ModelType

`ModelType` = `Model`\<`any`, \{ \}, \{ \}, \{ \}, `any`, `any`\>

##### Returns

`ModelType`

##### Inherited from

`Document.$model`

---

### $parent()

> **$parent**(): `undefined` \| `Document`\<`unknown`, `any`, `any`, `Record`\<`string`, `any`\>, \{ \}\>

Defined in: node_modules/mongoose/types/document.d.ts:234

If this document is a subdocument or populated document, returns the
document's parent. Returns undefined otherwise.

#### Returns

`undefined` \| `Document`\<`unknown`, `any`, `any`, `Record`\<`string`, `any`\>, \{ \}\>

#### Inherited from

`Document.$parent`

---

### $restoreModifiedPathsSnapshot()

> **$restoreModifiedPathsSnapshot**(`snapshot`): `this`

Defined in: node_modules/mongoose/types/document.d.ts:99

Restore this document's change tracking state to the given snapshot.
Note that `$restoreModifiedPathsSnapshot()` does **not** modify the document's
properties, just resets the change tracking state.

#### Parameters

##### snapshot

`ModifiedPathsSnapshot`

#### Returns

`this`

#### Inherited from

`Document.$restoreModifiedPathsSnapshot`

---

### $session()

> **$session**(`session?`): `null` \| `ClientSession`

Defined in: node_modules/mongoose/types/document.d.ts:106

Getter/setter around the session associated with this document. Used to
automatically set `session` if you `save()` a doc that you got from a
query with an associated session.

#### Parameters

##### session?

`null` | `ClientSession`

#### Returns

`null` \| `ClientSession`

#### Inherited from

`Document.$session`

---

### $set()

#### Call Signature

> **$set**(`path`, `val`, `type`, `options?`): `this`

Defined in: node_modules/mongoose/types/document.d.ts:109

Alias for `set()`, used internally to avoid conflicts

##### Parameters

###### path

`string` | `Record`\<`string`, `any`\>

###### val

`any`

###### type

`any`

###### options?

`DocumentSetOptions`

##### Returns

`this`

##### Inherited from

`Document.$set`

#### Call Signature

> **$set**(`path`, `val`, `options?`): `this`

Defined in: node_modules/mongoose/types/document.d.ts:110

Alias for `set()`, used internally to avoid conflicts

##### Parameters

###### path

`string` | `Record`\<`string`, `any`\>

###### val

`any`

###### options?

`DocumentSetOptions`

##### Returns

`this`

##### Inherited from

`Document.$set`

#### Call Signature

> **$set**(`value`): `this`

Defined in: node_modules/mongoose/types/document.d.ts:111

Alias for `set()`, used internally to avoid conflicts

##### Parameters

###### value

`string` | `Record`\<`string`, `any`\>

##### Returns

`this`

##### Inherited from

`Document.$set`

---

### deleteOne()

> **deleteOne**(`options?`): `any`

Defined in: node_modules/mongoose/types/document.d.ts:126

Removes this document from the db.

#### Parameters

##### options?

`QueryOptions`\<`unknown`\>

#### Returns

`any`

#### Inherited from

`Document.deleteOne`

---

### depopulate()

> **depopulate**\<`Paths`\>(`path?`): `MergeType`\<`UserOnboarding`, `Paths`\>

Defined in: node_modules/mongoose/types/document.d.ts:138

Takes a populated field and returns it to its unpopulated state. If called with
no arguments, then all populated fields are returned to their unpopulated state.

#### Type Parameters

##### Paths

`Paths` = \{ \}

#### Parameters

##### path?

`string` | `string`[]

#### Returns

`MergeType`\<`UserOnboarding`, `Paths`\>

#### Inherited from

`Document.depopulate`

---

### directModifiedPaths()

> **directModifiedPaths**(): `string`[]

Defined in: node_modules/mongoose/types/document.d.ts:145

Returns the list of paths that have been directly modified. A direct
modified path is a path that you explicitly set, whether via `doc.foo = 'bar'`,
`Object.assign(doc, { foo: 'bar' })`, or `doc.set('foo', 'bar')`.

#### Returns

`string`[]

#### Inherited from

`Document.directModifiedPaths`

---

### equals()

> **equals**(`doc`): `boolean`

Defined in: node_modules/mongoose/types/document.d.ts:154

Returns true if this document is equal to another document.

Documents are considered equal when they have matching `_id`s, unless neither
document has an `_id`, in which case this function falls back to using
`deepEqual()`.

#### Parameters

##### doc

`Document`\<`unknown`\>

#### Returns

`boolean`

#### Inherited from

`Document.equals`

---

### get()

#### Call Signature

> **get**\<`T`\>(`path`, `type?`, `options?`): `any`

Defined in: node_modules/mongoose/types/document.d.ts:160

Returns the value of a path.

##### Type Parameters

###### T

`T` _extends_ `string` \| `number` \| `symbol`

##### Parameters

###### path

`T`

###### type?

`any`

###### options?

`any`

##### Returns

`any`

##### Inherited from

`Document.get`

#### Call Signature

> **get**(`path`, `type?`, `options?`): `any`

Defined in: node_modules/mongoose/types/document.d.ts:161

Returns the value of a path.

##### Parameters

###### path

`string`

###### type?

`any`

###### options?

`any`

##### Returns

`any`

##### Inherited from

`Document.get`

---

### getChanges()

> **getChanges**(): `UpdateQuery`\<`UserOnboarding`\>

Defined in: node_modules/mongoose/types/document.d.ts:167

Returns the changes that happened to the document
in the format that will be sent to MongoDB.

#### Returns

`UpdateQuery`\<`UserOnboarding`\>

#### Inherited from

`Document.getChanges`

---

### increment()

> **increment**(): `this`

Defined in: node_modules/mongoose/types/document.d.ts:173

Signal that we desire an increment of this documents version.

#### Returns

`this`

#### Inherited from

`Document.increment`

---

### init()

> **init**(`obj`, `opts?`): `this`

Defined in: node_modules/mongoose/types/document.d.ts:180

Initializes the document without setters or marking anything modified.
Called internally after a document is returned from mongodb. Normally,
you do **not** need to call this function on your own.

#### Parameters

##### obj

`AnyObject`

##### opts?

`AnyObject`

#### Returns

`this`

#### Inherited from

`Document.init`

---

### invalidate()

#### Call Signature

> **invalidate**\<`T`\>(`path`, `errorMsg`, `value?`, `kind?`): `null` \| `NativeError`

Defined in: node_modules/mongoose/types/document.d.ts:183

Marks a path as invalid, causing validation to fail.

##### Type Parameters

###### T

`T` _extends_ `string` \| `number` \| `symbol`

##### Parameters

###### path

`T`

###### errorMsg

`string` | `NativeError`

###### value?

`any`

###### kind?

`string`

##### Returns

`null` \| `NativeError`

##### Inherited from

`Document.invalidate`

#### Call Signature

> **invalidate**(`path`, `errorMsg`, `value?`, `kind?`): `null` \| `NativeError`

Defined in: node_modules/mongoose/types/document.d.ts:184

Marks a path as invalid, causing validation to fail.

##### Parameters

###### path

`string`

###### errorMsg

`string` | `NativeError`

###### value?

`any`

###### kind?

`string`

##### Returns

`null` \| `NativeError`

##### Inherited from

`Document.invalidate`

---

### isDirectModified()

#### Call Signature

> **isDirectModified**\<`T`\>(`path`): `boolean`

Defined in: node_modules/mongoose/types/document.d.ts:187

Returns true if `path` was directly set and modified, else false.

##### Type Parameters

###### T

`T` _extends_ `string` \| `number` \| `symbol`

##### Parameters

###### path

`T` | `T`[]

##### Returns

`boolean`

##### Inherited from

`Document.isDirectModified`

#### Call Signature

> **isDirectModified**(`path`): `boolean`

Defined in: node_modules/mongoose/types/document.d.ts:188

Returns true if `path` was directly set and modified, else false.

##### Parameters

###### path

`string` | `string`[]

##### Returns

`boolean`

##### Inherited from

`Document.isDirectModified`

---

### isDirectSelected()

#### Call Signature

> **isDirectSelected**\<`T`\>(`path`): `boolean`

Defined in: node_modules/mongoose/types/document.d.ts:191

Checks if `path` was explicitly selected. If no projection, always returns true.

##### Type Parameters

###### T

`T` _extends_ `string` \| `number` \| `symbol`

##### Parameters

###### path

`T`

##### Returns

`boolean`

##### Inherited from

`Document.isDirectSelected`

#### Call Signature

> **isDirectSelected**(`path`): `boolean`

Defined in: node_modules/mongoose/types/document.d.ts:192

Checks if `path` was explicitly selected. If no projection, always returns true.

##### Parameters

###### path

`string`

##### Returns

`boolean`

##### Inherited from

`Document.isDirectSelected`

---

### isInit()

#### Call Signature

> **isInit**\<`T`\>(`path`): `boolean`

Defined in: node_modules/mongoose/types/document.d.ts:195

Checks if `path` is in the `init` state, that is, it was set by `Document#init()` and not modified since.

##### Type Parameters

###### T

`T` _extends_ `string` \| `number` \| `symbol`

##### Parameters

###### path

`T`

##### Returns

`boolean`

##### Inherited from

`Document.isInit`

#### Call Signature

> **isInit**(`path`): `boolean`

Defined in: node_modules/mongoose/types/document.d.ts:196

Checks if `path` is in the `init` state, that is, it was set by `Document#init()` and not modified since.

##### Parameters

###### path

`string`

##### Returns

`boolean`

##### Inherited from

`Document.isInit`

---

### isModified()

#### Call Signature

> **isModified**\<`T`\>(`path?`, `options?`): `boolean`

Defined in: node_modules/mongoose/types/document.d.ts:202

Returns true if any of the given paths are modified, else false. If no arguments, returns `true` if any path
in this document is modified.

##### Type Parameters

###### T

`T` _extends_ `string` \| `number` \| `symbol`

##### Parameters

###### path?

`T` | `T`[]

###### options?

`null` | \{ `ignoreAtomics?`: `boolean`; \}

##### Returns

`boolean`

##### Inherited from

`Document.isModified`

#### Call Signature

> **isModified**(`path?`, `options?`): `boolean`

Defined in: node_modules/mongoose/types/document.d.ts:203

Returns true if any of the given paths are modified, else false. If no arguments, returns `true` if any path
in this document is modified.

##### Parameters

###### path?

`string` | `string`[]

###### options?

`null` | \{ `ignoreAtomics?`: `boolean`; \}

##### Returns

`boolean`

##### Inherited from

`Document.isModified`

---

### isSelected()

#### Call Signature

> **isSelected**\<`T`\>(`path`): `boolean`

Defined in: node_modules/mongoose/types/document.d.ts:209

Checks if `path` was selected in the source query which initialized this document.

##### Type Parameters

###### T

`T` _extends_ `string` \| `number` \| `symbol`

##### Parameters

###### path

`T`

##### Returns

`boolean`

##### Inherited from

`Document.isSelected`

#### Call Signature

> **isSelected**(`path`): `boolean`

Defined in: node_modules/mongoose/types/document.d.ts:210

Checks if `path` was selected in the source query which initialized this document.

##### Parameters

###### path

`string`

##### Returns

`boolean`

##### Inherited from

`Document.isSelected`

---

### markModified()

#### Call Signature

> **markModified**\<`T`\>(`path`, `scope?`): `void`

Defined in: node_modules/mongoose/types/document.d.ts:213

Marks the path as having pending changes to write to the db.

##### Type Parameters

###### T

`T` _extends_ `string` \| `number` \| `symbol`

##### Parameters

###### path

`T`

###### scope?

`any`

##### Returns

`void`

##### Inherited from

`Document.markModified`

#### Call Signature

> **markModified**(`path`, `scope?`): `void`

Defined in: node_modules/mongoose/types/document.d.ts:214

Marks the path as having pending changes to write to the db.

##### Parameters

###### path

`string`

###### scope?

`any`

##### Returns

`void`

##### Inherited from

`Document.markModified`

---

### model()

#### Call Signature

> **model**\<`ModelType`\>(`name`): `ModelType`

Defined in: node_modules/mongoose/types/document.d.ts:217

Returns the model with the given name on this document's associated connection.

##### Type Parameters

###### ModelType

`ModelType` = `Model`\<`unknown`, \{ \}, \{ \}, \{ \}, `Document`\<`unknown`, \{ \}, `unknown`, \{ \}, \{ \}\> & `object` & `object`, `any`\>

##### Parameters

###### name

`string`

##### Returns

`ModelType`

##### Inherited from

`Document.model`

#### Call Signature

> **model**\<`ModelType`\>(): `ModelType`

Defined in: node_modules/mongoose/types/document.d.ts:218

Returns the model with the given name on this document's associated connection.

##### Type Parameters

###### ModelType

`ModelType` = `Model`\<`any`, \{ \}, \{ \}, \{ \}, `any`, `any`\>

##### Returns

`ModelType`

##### Inherited from

`Document.model`

---

### modifiedPaths()

> **modifiedPaths**(`options?`): `string`[]

Defined in: node_modules/mongoose/types/document.d.ts:221

Returns the list of paths that have been modified.

#### Parameters

##### options?

###### includeChildren?

`boolean`

#### Returns

`string`[]

#### Inherited from

`Document.modifiedPaths`

---

### overwrite()

> **overwrite**(`obj`): `this`

Defined in: node_modules/mongoose/types/document.d.ts:228

Overwrite all values in this document with the values of `obj`, except
for immutable properties. Behaves similarly to `set()`, except for it
unsets all properties that aren't in `obj`.

#### Parameters

##### obj

`AnyObject`

#### Returns

`this`

#### Inherited from

`Document.overwrite`

---

### populate()

#### Call Signature

> **populate**\<`Paths`\>(`path`): `Promise`\<`MergeType`\<`UserOnboarding`, `Paths`\>\>

Defined in: node_modules/mongoose/types/document.d.ts:237

Populates document references.

##### Type Parameters

###### Paths

`Paths` = \{ \}

##### Parameters

###### path

`string` | `PopulateOptions` | (`string` \| `PopulateOptions`)[]

##### Returns

`Promise`\<`MergeType`\<`UserOnboarding`, `Paths`\>\>

##### Inherited from

`Document.populate`

#### Call Signature

> **populate**\<`Paths`\>(`path`, `select?`, `model?`, `match?`, `options?`): `Promise`\<`MergeType`\<`UserOnboarding`, `Paths`\>\>

Defined in: node_modules/mongoose/types/document.d.ts:238

Populates document references.

##### Type Parameters

###### Paths

`Paths` = \{ \}

##### Parameters

###### path

`string`

###### select?

`string` | `AnyObject`

###### model?

`Model`\<`any`, \{ \}, \{ \}, \{ \}, `any`, `any`\>

###### match?

`AnyObject`

###### options?

`PopulateOptions`

##### Returns

`Promise`\<`MergeType`\<`UserOnboarding`, `Paths`\>\>

##### Inherited from

`Document.populate`

---

### populated()

> **populated**(`path`): `any`

Defined in: node_modules/mongoose/types/document.d.ts:241

Gets \_id(s) used during population of the given `path`. If the path was not populated, returns `undefined`.

#### Parameters

##### path

`string`

#### Returns

`any`

#### Inherited from

`Document.populated`

---

### replaceOne()

> **replaceOne**(`replacement?`, `options?`): `Query`\<`any`, `UserOnboarding`\>

Defined in: node_modules/mongoose/types/document.d.ts:244

Sends a replaceOne command with this document `_id` as the query selector.

#### Parameters

##### replacement?

`AnyObject`

##### options?

`null` | `QueryOptions`\<`unknown`\>

#### Returns

`Query`\<`any`, `UserOnboarding`\>

#### Inherited from

`Document.replaceOne`

---

### save()

> **save**(`options?`): `Promise`\<`UserOnboarding`\>

Defined in: node_modules/mongoose/types/document.d.ts:247

Saves this document by inserting a new document into the database if [document.isNew](/docs/api/document.html#document_Document-isNew) is `true`, or sends an [updateOne](/docs/api/document.html#document_Document-updateOne) operation with just the modified paths if `isNew` is `false`.

#### Parameters

##### options?

`SaveOptions`

#### Returns

`Promise`\<`UserOnboarding`\>

#### Inherited from

`Document.save`

---

### set()

#### Call Signature

> **set**\<`T`\>(`path`, `val`, `type`, `options?`): `this`

Defined in: node_modules/mongoose/types/document.d.ts:253

Sets the value of a path, or many paths.

##### Type Parameters

###### T

`T` _extends_ `string` \| `number` \| `symbol`

##### Parameters

###### path

`T`

###### val

`any`

###### type

`any`

###### options?

`DocumentSetOptions`

##### Returns

`this`

##### Inherited from

`Document.set`

#### Call Signature

> **set**(`path`, `val`, `type`, `options?`): `this`

Defined in: node_modules/mongoose/types/document.d.ts:254

Sets the value of a path, or many paths.

##### Parameters

###### path

`string` | `Record`\<`string`, `any`\>

###### val

`any`

###### type

`any`

###### options?

`DocumentSetOptions`

##### Returns

`this`

##### Inherited from

`Document.set`

#### Call Signature

> **set**(`path`, `val`, `options?`): `this`

Defined in: node_modules/mongoose/types/document.d.ts:255

Sets the value of a path, or many paths.

##### Parameters

###### path

`string` | `Record`\<`string`, `any`\>

###### val

`any`

###### options?

`DocumentSetOptions`

##### Returns

`this`

##### Inherited from

`Document.set`

#### Call Signature

> **set**(`value`): `this`

Defined in: node_modules/mongoose/types/document.d.ts:256

Sets the value of a path, or many paths.

##### Parameters

###### value

`string` | `Record`\<`string`, `any`\>

##### Returns

`this`

##### Inherited from

`Document.set`

---

### toJSON()

#### Call Signature

> **toJSON**(`options`): `any`

Defined in: node_modules/mongoose/types/document.d.ts:259

The return value of this method is used in calls to JSON.stringify(doc).

##### Parameters

###### options

`ToObjectOptions`\<`unknown`, `Document`\<`unknown`, \{ \}, `unknown`, \{ \}, \{ \}\> & `object` & `object`\> & `object`

##### Returns

`any`

##### Inherited from

`Document.toJSON`

#### Call Signature

> **toJSON**(`options?`): `FlattenMaps`\<`Default__v`\<`Require_id`\<`DocType`\>, `TSchemaOptions`\>\>

Defined in: node_modules/mongoose/types/document.d.ts:260

The return value of this method is used in calls to JSON.stringify(doc).

##### Parameters

###### options?

`ToObjectOptions`\<`unknown`, `Document`\<`unknown`, \{ \}, `unknown`, \{ \}, \{ \}\> & `object` & `object`\> & `object`

##### Returns

`FlattenMaps`\<`Default__v`\<`Require_id`\<`DocType`\>, `TSchemaOptions`\>\>

##### Inherited from

`Document.toJSON`

#### Call Signature

> **toJSON**(`options`): `FlattenMaps`\<`Default__v`\<`Require_id`\<`DocType`\>, `TSchemaOptions`\>\>

Defined in: node_modules/mongoose/types/document.d.ts:261

The return value of this method is used in calls to JSON.stringify(doc).

##### Parameters

###### options

`ToObjectOptions`\<`unknown`, `Document`\<`unknown`, \{ \}, `unknown`, \{ \}, \{ \}\> & `object` & `object`\> & `object`

##### Returns

`FlattenMaps`\<`Default__v`\<`Require_id`\<`DocType`\>, `TSchemaOptions`\>\>

##### Inherited from

`Document.toJSON`

#### Call Signature

> **toJSON**(`options`): `object`

Defined in: node_modules/mongoose/types/document.d.ts:262

The return value of this method is used in calls to JSON.stringify(doc).

##### Parameters

###### options

`ToObjectOptions`\<`unknown`, `Document`\<`unknown`, \{ \}, `unknown`, \{ \}, \{ \}\> & `object` & `object`\> & `object`

##### Returns

`object`

##### Inherited from

`Document.toJSON`

#### Call Signature

> **toJSON**(`options`): `any`

Defined in: node_modules/mongoose/types/document.d.ts:263

The return value of this method is used in calls to JSON.stringify(doc).

##### Parameters

###### options

`ToObjectOptions`\<`unknown`, `Document`\<`unknown`, \{ \}, `unknown`, \{ \}, \{ \}\> & `object` & `object`\> & `object`

##### Returns

`any`

##### Inherited from

`Document.toJSON`

#### Call Signature

> **toJSON**(`options`): `any`

Defined in: node_modules/mongoose/types/document.d.ts:264

The return value of this method is used in calls to JSON.stringify(doc).

##### Parameters

###### options

`ToObjectOptions`\<`unknown`, `Document`\<`unknown`, \{ \}, `unknown`, \{ \}, \{ \}\> & `object` & `object`\> & `object`

##### Returns

`any`

##### Inherited from

`Document.toJSON`

#### Call Signature

> **toJSON**\<`T`\>(`options?`): `FlattenMaps`\<`T`\>

Defined in: node_modules/mongoose/types/document.d.ts:266

The return value of this method is used in calls to JSON.stringify(doc).

##### Type Parameters

###### T

`T` = `any`

##### Parameters

###### options?

`ToObjectOptions`\<`unknown`, `Document`\<`unknown`, \{ \}, `unknown`, \{ \}, \{ \}\> & `object` & `object`\> & `object`

##### Returns

`FlattenMaps`\<`T`\>

##### Inherited from

`Document.toJSON`

#### Call Signature

> **toJSON**\<`T`\>(`options`): `FlattenMaps`\<`T`\>

Defined in: node_modules/mongoose/types/document.d.ts:267

The return value of this method is used in calls to JSON.stringify(doc).

##### Type Parameters

###### T

`T` = `any`

##### Parameters

###### options

`ToObjectOptions`\<`unknown`, `Document`\<`unknown`, \{ \}, `unknown`, \{ \}, \{ \}\> & `object` & `object`\> & `object`

##### Returns

`FlattenMaps`\<`T`\>

##### Inherited from

`Document.toJSON`

#### Call Signature

> **toJSON**\<`T`\>(`options`): `ObjectIdToString`\<`FlattenMaps`\<`T`\>\>

Defined in: node_modules/mongoose/types/document.d.ts:268

The return value of this method is used in calls to JSON.stringify(doc).

##### Type Parameters

###### T

`T` = `any`

##### Parameters

###### options

`ToObjectOptions`\<`unknown`, `Document`\<`unknown`, \{ \}, `unknown`, \{ \}, \{ \}\> & `object` & `object`\> & `object`

##### Returns

`ObjectIdToString`\<`FlattenMaps`\<`T`\>\>

##### Inherited from

`Document.toJSON`

#### Call Signature

> **toJSON**\<`T`\>(`options`): `T`

Defined in: node_modules/mongoose/types/document.d.ts:269

The return value of this method is used in calls to JSON.stringify(doc).

##### Type Parameters

###### T

`T` = `any`

##### Parameters

###### options

`ToObjectOptions`\<`unknown`, `Document`\<`unknown`, \{ \}, `unknown`, \{ \}, \{ \}\> & `object` & `object`\> & `object`

##### Returns

`T`

##### Inherited from

`Document.toJSON`

#### Call Signature

> **toJSON**\<`T`\>(`options`): `ObjectIdToString`\<`T`\>

Defined in: node_modules/mongoose/types/document.d.ts:270

The return value of this method is used in calls to JSON.stringify(doc).

##### Type Parameters

###### T

`T` = `any`

##### Parameters

###### options

`ToObjectOptions`\<`unknown`, `Document`\<`unknown`, \{ \}, `unknown`, \{ \}, \{ \}\> & `object` & `object`\> & `object`

##### Returns

`ObjectIdToString`\<`T`\>

##### Inherited from

`Document.toJSON`

---

### toObject()

#### Call Signature

> **toObject**(`options`): `any`

Defined in: node_modules/mongoose/types/document.d.ts:273

Converts this document into a plain-old JavaScript object ([POJO](https://masteringjs.io/tutorials/fundamentals/pojo)).

##### Parameters

###### options

`ToObjectOptions`\<`unknown`, `Document`\<`unknown`, \{ \}, `unknown`, \{ \}, \{ \}\> & `object` & `object`\> & `object`

##### Returns

`any`

##### Inherited from

`Document.toObject`

#### Call Signature

> **toObject**(`options?`): `any`

Defined in: node_modules/mongoose/types/document.d.ts:274

Converts this document into a plain-old JavaScript object ([POJO](https://masteringjs.io/tutorials/fundamentals/pojo)).

##### Parameters

###### options?

`ToObjectOptions`\<`unknown`, `Document`\<`unknown`, \{ \}, `unknown`, \{ \}, \{ \}\> & `object` & `object`\>

##### Returns

`any`

##### Inherited from

`Document.toObject`

#### Call Signature

> **toObject**\<`T`\>(`options?`): `Require_id`\<`T`\> _extends_ `object` ? `object` & `Require_id`\<`T`\> : `Require_id`\<`T`\> & `object`

Defined in: node_modules/mongoose/types/document.d.ts:275

Converts this document into a plain-old JavaScript object ([POJO](https://masteringjs.io/tutorials/fundamentals/pojo)).

##### Type Parameters

###### T

`T`

##### Parameters

###### options?

`ToObjectOptions`\<`unknown`, `Document`\<`unknown`, \{ \}, `unknown`, \{ \}, \{ \}\> & `object` & `object`\>

##### Returns

`Require_id`\<`T`\> _extends_ `object` ? `object` & `Require_id`\<`T`\> : `Require_id`\<`T`\> & `object`

##### Inherited from

`Document.toObject`

---

### unmarkModified()

#### Call Signature

> **unmarkModified**\<`T`\>(`path`): `void`

Defined in: node_modules/mongoose/types/document.d.ts:278

Clears the modified state on the specified path.

##### Type Parameters

###### T

`T` _extends_ `string` \| `number` \| `symbol`

##### Parameters

###### path

`T`

##### Returns

`void`

##### Inherited from

`Document.unmarkModified`

#### Call Signature

> **unmarkModified**(`path`): `void`

Defined in: node_modules/mongoose/types/document.d.ts:279

Clears the modified state on the specified path.

##### Parameters

###### path

`string`

##### Returns

`void`

##### Inherited from

`Document.unmarkModified`

---

### updateOne()

> **updateOne**(`update?`, `options?`): `Query`\<`any`, `UserOnboarding`\>

Defined in: node_modules/mongoose/types/document.d.ts:282

Sends an updateOne command with this document `_id` as the query selector.

#### Parameters

##### update?

`UpdateQuery`\<`UserOnboarding`\> | `UpdateWithAggregationPipeline`

##### options?

`null` | `QueryOptions`\<`unknown`\>

#### Returns

`Query`\<`any`, `UserOnboarding`\>

#### Inherited from

`Document.updateOne`

---

### validate()

#### Call Signature

> **validate**\<`T`\>(`pathsToValidate?`, `options?`): `Promise`\<`void`\>

Defined in: node_modules/mongoose/types/document.d.ts:285

Executes registered validation rules for this document.

##### Type Parameters

###### T

`T` _extends_ `string` \| `number` \| `symbol`

##### Parameters

###### pathsToValidate?

`T` | `T`[]

###### options?

`AnyObject`

##### Returns

`Promise`\<`void`\>

##### Inherited from

`Document.validate`

#### Call Signature

> **validate**(`pathsToValidate?`, `options?`): `Promise`\<`void`\>

Defined in: node_modules/mongoose/types/document.d.ts:286

Executes registered validation rules for this document.

##### Parameters

###### pathsToValidate?

`PathsToValidate`

###### options?

`AnyObject`

##### Returns

`Promise`\<`void`\>

##### Inherited from

`Document.validate`

#### Call Signature

> **validate**(`options`): `Promise`\<`void`\>

Defined in: node_modules/mongoose/types/document.d.ts:287

Executes registered validation rules for this document.

##### Parameters

###### options

###### pathsToSkip?

`pathsToSkip`

##### Returns

`Promise`\<`void`\>

##### Inherited from

`Document.validate`

---

### validateSync()

#### Call Signature

> **validateSync**(`options`): `null` \| `ValidationError`

Defined in: node_modules/mongoose/types/document.d.ts:290

Executes registered validation rules (skipping asynchronous validators) for this document.

##### Parameters

###### options

###### pathsToSkip?

`pathsToSkip`

##### Returns

`null` \| `ValidationError`

##### Inherited from

`Document.validateSync`

#### Call Signature

> **validateSync**\<`T`\>(`pathsToValidate?`, `options?`): `null` \| `ValidationError`

Defined in: node_modules/mongoose/types/document.d.ts:291

Executes registered validation rules (skipping asynchronous validators) for this document.

##### Type Parameters

###### T

`T` _extends_ `string` \| `number` \| `symbol`

##### Parameters

###### pathsToValidate?

`T` | `T`[]

###### options?

`AnyObject`

##### Returns

`null` \| `ValidationError`

##### Inherited from

`Document.validateSync`

#### Call Signature

> **validateSync**(`pathsToValidate?`, `options?`): `null` \| `ValidationError`

Defined in: node_modules/mongoose/types/document.d.ts:292

Executes registered validation rules (skipping asynchronous validators) for this document.

##### Parameters

###### pathsToValidate?

`PathsToValidate`

###### options?

`AnyObject`

##### Returns

`null` \| `ValidationError`

##### Inherited from

`Document.validateSync`
