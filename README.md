# MC-KM-NBT

[![version](https://img.shields.io/github/v/release/KalmeMarq/FKM-NBT?color=7500A4&label=&style=for-the-badge)](https://github.com/KalmeMarq/FKM-NBT/releases)&nbsp;&nbsp;[![deno](https://img.shields.io/badge/View%20on%20Deno-0E7EEE?style=for-the-badge&logo=deno&logoColor=white)](https://deno.land/x/fkm_nbt)&nbsp;&nbsp;[![npm](https://img.shields.io/badge/View%20on%20NPM-0A0?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/package/fkm-nbt)&nbsp;

#### Coming Soon
```ts
...
const nbt = NBTUtils.read(data, 'varInt')
const nbt1 = NBTUtils.read(data, 'auto')

const regionFile = NBTUtils.readRegionFile(buffer)
```

### Examples
```ts
const comp = new NBTCompound()
comp.putInt('name', 'Test')

const compD = NBTUtils.write(comp)
const compDC = NBTUtils.writeCompressed(comp)

...
const rcompD = NBTUtils.read(bufferD)
const rcompDC = NBTUtils.readCompressed(bufferDC)

```

```ts
const board = new NBTCompound()
board.putInt('id', 351325)
board.putString('name', 'Board Name')
board.putInt('createdAt', Date.now())

const lists = new NBTList()

const list1 = new NBTCompound()
list1.putInt('id', 446)
list1.putString('name', 'To Do')

lists.add(list1)

board.put('lists', lists)
```

```ts
const boardJ = JNBT.comp({
  id: JNBT.int(462346),
  name: JNBT.string('Another Board'),
  createdAt: JNBT.int(Date.now()),
  lists: JNBT.list([
    JNBT.comp({
      id: JNBT.int(345),
      name: JNBT.string('Done')
    })
  ])
})

const board = NBTUtils.jnbtToNBT(boardJ)
```

JSNBT: Numbers with decimals are read as NBTFloat and the rest as NBTInt (or NBTLong if it's a bigint)
```ts
const boardJS = {
  id: 6456,
  name: 'Name',
  createdAt: Date.now(),
  lists: [
    {
      id: 5747,
      name: 'Doing'
    }
  ]
}

const board = NBTUtils.jsnbtToNBT(boardJS)
```

```ts
const nbt = NBTUtils.snbtToNBT('{name: "Bot", age: 1000, props: { health: 20, xpLevel: 20L }}, blocks: [B;2, 4, 1]')
const treeView = NBTUtils.nbtToTreeView(nbt)

/*
TAG_Compound(''): 1 entry
{
  TAG_String('name'): 'Bot'
  TAG_Int('age'): 1000
  TAG_Compound('props'): 2 entries
  {
    TAG_Int('health'): 20
    TAG_Byte('xpLevel'): 20n
  },
  TAG_Byte_Array('blocks): 3 entries
  {
    TAG_Byte(None): 2
    TAG_Byte(None): 4
    TAG_Byte(None): 1
  }
}
*/
```

```ts
const nbt = NBTUtils.snbtToNBT('{name: "Bot", age: 1000, props: { health: 20, xpLevel: 20L }}')

const snbt = NBTUtils.nbtToSNBT(nbt, /* prettify */false, /* colorType(none (default), motd, ansi)*/ 'none')

// minified 
// {name:"Bot",age:1000,props:{health:20,xpLevel:20L}}

/* prettified
{
  name: "Bot",
  age: 1000,
  props: {
    health: 20,
    xpLevel: 20L
  }
}
*/

// nbt.asString()

```

#### Very Useless Shortcuts
- TAG_ELEMENT.asString() -> snbt
- NBTUtils.snbtToTreeView -> NBTUtils.snbtToNBT -> NBTUtils.nbtToTreeView
- NBTUtils.jnbtToTreeView -> NBTUtils.jnbtToNBT -> NBTUtils.nbtToTreeView
- NBTUtils.jsnbtToTreeView -> NBTUtils.jsnbtToNBT -> NBTUtils.nbtToTreeView
- NBTUtils.snbtToJNBT -> NBTUtils.snbtToNBT -> NBTUtils.nbtToJNBT
- NBTUtils.jsnbtToJNBT -> NBTUtils.jsnbtToNBT -> NBTUtils.nbtToJNBT
- NBTUtils.snbtToJSNBT -> NBTUtils.snbtToNBT -> NBTUtils.nbtToJSNBT
- NBTUtils.jnbtToJSNBT -> NBTUtils.jnbtToNBT -> NBTUtils.nbtToJSNBT

#### No longer available

```ts
const boardS = '{id: 46457, name: "Board", createdAt: 1913573456L, blocks: [34b, 35b, 3b] }'

NBTUtils.nbtToJNBT(board) // { "type": "compound", "value": { "id": { "type": "int", "value": 46457 }, "name": { "type": "Board" }, "createdAt": { "type": "long", "value": 1913573456n }, "blocks": { "type": "byte_array", "value": [ { "type": "byte", "value": 34 }, { "type": "byte", "value": 35 }, { "type": "byte", "value": 3 } ] } } }
NBTUtils.nbtToJSNBT(board) // {"id": 46457, "name": "Board", "createdAt": 1913573456, "blocks": [34, 3515, 351345] }
```
