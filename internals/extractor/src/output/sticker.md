# Sticker Resource


### Sticker Object

Represents a sticker that can be sent in messages.


### Sticker Structure

Field | Type | Description
--- | --- | ---
id | snowflake | id of the sticker
pack_id? | snowflake | for standard stickers, id of the pack the sticker is from
name | string | name of the sticker
description | ?string | description of the sticker
tags* | string | autocomplete/suggestion tags for the sticker (max 200 characters)
type | integer | type of sticker
format_type | integer | type of sticker format
available? | boolean | whether this guild sticker can be used, may be false due to loss of Server Boosts
guild_id? | snowflake | id of the guild that owns this sticker
user? | user object | the user that uploaded the guild sticker
sort_value? | integer | the standard sticker's sort order within its pack

\* A comma separated list of keywords is the format used in this field by standard stickers, but this is just a convention. Incidentally the client will always use a name generated from an emoji as the value of this field when creating or modifying a guild sticker.


### Sticker Types

Type | Value | Description
--- | --- | ---
STANDARD | 1 | an official sticker in a pack
GUILD | 2 | a sticker uploaded to a guild for the guild's members


### Sticker Format Types

Type | Value
--- | ---
PNG | 1
APNG | 2
LOTTIE | 3
GIF | 4


### Example Sticker
```json
{
  "id": "749054660769218631",
  "name": "Wave",
  "tags": "wumpus, hello, sup, hi, oi, heyo, heya, yo, greetings, greet, welcome, wave, :wave, :hello, :hi, :hey, hey, \ud83d\udc4b, \ud83d\udc4b\ud83c\udffb, \ud83d\udc4b\ud83c\udffc, \ud83d\udc4b\ud83c\udffd, \ud83d\udc4b\ud83c\udffe, \ud83d\udc4b\ud83c\udfff, goodbye, bye, see ya, later, laterz, cya",
  "type": 1,
  "format_type": 3,
  "description": "Wumpus waves hello",
  "pack_id": "847199849233514549",
  "sort_value": 12
}
```


### Sticker Item Object

The smallest amount of data required to render a sticker. A partial sticker object.


### Sticker Item Structure

Field | Type | Description
--- | --- | ---
id | snowflake | id of the sticker
name | string | name of the sticker
format_type | integer | type of sticker format


### Sticker Pack Object

Represents a pack of standard stickers.


### Sticker Pack Structure

Field | Type | Description
--- | --- | ---
id | snowflake | id of the sticker pack
stickers | array of sticker objects | the stickers in the pack
name | string | name of the sticker pack
sku_id | snowflake | id of the pack's SKU
cover_sticker_id? | snowflake | id of a sticker in the pack which is shown as the pack's icon
description | string | description of the sticker pack
banner_asset_id? | snowflake | id of the sticker pack's banner image


### Example Sticker Pack
```json
{
  "id": "847199849233514549",
  "stickers": [],
  "name": "Wumpus Beyond",
  "sku_id": "847199849233514547",
  "cover_sticker_id": "749053689419006003",
  "description": "Say hello to Wumpus!",
  "banner_asset_id": "761773777976819732"
}
```



---

## Get Sticker

`GET` `/stickers/` [{sticker.id}](/docs/resources/sticker#sticker-object)

Returns a [sticker](/docs/resources/sticker#sticker-object) object for the given sticker ID.



---

## List Sticker Packs

`GET` `/sticker-packs`

Returns a list of available sticker packs.


### Response Structure

Field | Type
--- | ---
sticker_packs | array of sticker pack objects



---

## Get Sticker Pack

`GET` `/sticker-packs/` [{pack.id}](/docs/resources/sticker#sticker-pack-object)

Returns a [sticker pack](/docs/resources/sticker#sticker-pack-object) object for the given sticker pack ID.



---

## List Guild Stickers

`GET` `/guilds/` [{guild.id}](/docs/resources/guild#guild-object)/stickers

Returns an array of [sticker](/docs/resources/sticker#sticker-object) objects for the given guild. Includes `user` fields if the bot has the `CREATE_GUILD_EXPRESSIONS` or `MANAGE_GUILD_EXPRESSIONS` permission.



---

## Get Guild Sticker

`GET` `/guilds/` [{guild.id}](/docs/resources/guild#guild-object)/stickers/[{sticker.id}](/docs/resources/sticker#sticker-object)

Returns a [sticker](/docs/resources/sticker#sticker-object) object for the given guild and sticker IDs. Includes the `user` field if the bot has the `CREATE_GUILD_EXPRESSIONS` or `MANAGE_GUILD_EXPRESSIONS` permission.



---

## Create Guild Sticker

`POST` `/guilds/` [{guild.id}](/docs/resources/guild#guild-object)/stickers

Create a new sticker for the guild. Send a `multipart/form-data` body. Requires the `CREATE_GUILD_EXPRESSIONS` permission. Returns the new [sticker](/docs/resources/sticker#sticker-object) object on success. Fires a [Guild Stickers Update](/docs/events/gateway-events#guild-stickers-update) Gateway event.

Every guilds has five free sticker slots by default, and each Boost level will grant access to more slots.

This endpoint supports the `X-Audit-Log-Reason` header.

Lottie stickers can only be uploaded on guilds that have either the `VERIFIED` and/or the `PARTNERED` [guild feature](/docs/resources/guild#guild-object-guild-features).

Uploaded stickers are constrained to 5 seconds in length for animated stickers, and 320 x 320 pixels.


### Form Params

Field | Type | Description
--- | --- | ---
name | string | name of the sticker (2-30 characters)
description | string | description of the sticker (empty or 2-100 characters)
tags | string | autocomplete/suggestion tags for the sticker (max 200 characters)
file | file contents | the sticker file to upload, must be a PNG, APNG, GIF, or Lottie JSON file, max 512 KiB



---

## Modify Guild Sticker

`PATCH` `/guilds/` [{guild.id}](/docs/resources/guild#guild-object)/stickers/[{sticker.id}](/docs/resources/sticker#sticker-object)

Modify the given sticker. For stickers created by the current user, requires either the `CREATE_GUILD_EXPRESSIONS` or `MANAGE_GUILD_EXPRESSIONS` permission. For other stickers, requires the `MANAGE_GUILD_EXPRESSIONS` permission. Returns the updated [sticker](/docs/resources/sticker#sticker-object) object on success. Fires a [Guild Stickers Update](/docs/events/gateway-events#guild-stickers-update) Gateway event.

All parameters to this endpoint are optional.

This endpoint supports the `X-Audit-Log-Reason` header.


### JSON Params

Field | Type | Description
--- | --- | ---
name | string | name of the sticker (2-30 characters)
description | ?string | description of the sticker (2-100 characters)
tags | string | autocomplete/suggestion tags for the sticker (max 200 characters)



---

## Delete Guild Sticker

`DELETE` `/guilds/` [{guild.id}](/docs/resources/guild#guild-object)/stickers/[{sticker.id}](/docs/resources/sticker#sticker-object)

Delete the given sticker. For stickers created by the current user, requires either the `CREATE_GUILD_EXPRESSIONS` or `MANAGE_GUILD_EXPRESSIONS` permission. For other stickers, requires the `MANAGE_GUILD_EXPRESSIONS` permission. Returns `204 No Content` on success. Fires a [Guild Stickers Update](/docs/events/gateway-events#guild-stickers-update) Gateway event.

This endpoint supports the `X-Audit-Log-Reason` header.