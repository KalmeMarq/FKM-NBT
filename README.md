# MC-KM-NBT

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

#### Not available yet
```ts
const boardS = '{id: 46457, name: "Board", createdAt: 1913573456L, users: [I; 34, 3515, 351345] }'

const board = NBTHelper.snbtToNBT(boardS)

NBTHelper.nbtToSNBT(board)
NBTHelper.nbtToJNBT(board)
NBTHelper.nbtToJSNBT(board)
...etc
```
