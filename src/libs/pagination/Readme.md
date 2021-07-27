# 🔢| Pagination.ts
Paged navigation for long "message text" or {embedObjects} Array using Emoji 

## Importing :
```typescript
import sendPages from <DIRNAME>/pagination/index
```

## Arguments :
Arguments   |required?
-----------|----------
[MessageObject](https://discord.js.org/#/docs/main/stable/class/Message) | `required`
[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) or [EmbedObject](https://discord.js.org/#/docs/main/stable/class/MessageEmbed) Array | `required`
ErrorCallback Function | `optional`
WarningCallback Function | `optional`

## Exemples :
> Assuming `message` is message object 
```typescript
import sendPages from "../pagination/index"

sendPages(message,"long long text...")

sendPages(message,[embed1,embed2,...], console.error, console.warn)
```