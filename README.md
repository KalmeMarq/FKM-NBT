# MC-KM-NBT

It's still in early development so not everything is done or expected to work yet

## Working on
#### Parcially available
```ts
const boardS = '{id: 46457, name: "Board", createdAt: 1913573456L, blocks: [34b, 35b, 3b] }'

const board = NBTHelper.snbtToNBT(boardS)

NBTHelper.nbtToSNBT(board) // {id: 46457,name:"Board",createdAt:1913573456L,blocks:[34b, 3515b, 351345b]}
NBTHelper.nbtToJNBT(board) // { "type": "compound", "value": { "id": { "type": "int", "value": 46457 }, "name": { "type": "Board" }, "createdAt": { "type": "long", "value": 1913573456n }, "blocks": { "type": "byte_array", "value": [ { "type": "byte", "value": 34 }, { "type": "byte", "value": 35 }, { "type": "byte", "value": 3 } ] } } }
NBTHelper.nbtToJSNBT(board) // {"id": 46457, "name": "Board", "createdAt": 1913573456, "blocks": [34, 3515, 351345] }
```

#### Not available yet
```ts
const nbt = NBTHelper.snbtToNBT('{name: "Bot", age: 1000, props: { health: 20, xpLevel: 20L }}')

const treeView = NBTHelper.nbtToTreeView(nbt)
/*
TAG_Compound(''): 1 entry
{
  TAG_String('name'): 'Bot'
  TAG_Int('age'): 1000
  TAG_Compound('props'): 2 entries
  {
    TAG_Int('health'): 20
    TAG_Byte('xpLevel'): 20n
  }
}
*/

const snbt = NBTHelper.nbtToSNBT(nbt, /* minify */false)
/*
{
  name: "Bot",
  age: 1000,
  props: {
    health: 20,
    xpLevel: 20L
  }
}
*/

const regionFile = NBTHelper.readRegionFile(buffer)
```

### Examples
```ts
const comp = new NBTCompound()
comp.putInt('name', 'Test')

const compD = NBTHelper.write(comp)
const compDC = NBTHelper.writeCompressed(comp)

...
const rcompD = NBTHelper.read(bufferD)
const rcompDC = NBTHelper.readCompressed(bufferDC)

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

const board = NBTHelper.jnbtToNBT(boardJ)
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

const board = NBTHelper.jsnbtToNBT(boardJS)
```