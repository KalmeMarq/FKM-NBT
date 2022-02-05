import { JNBT, NBTHelper, NBTCompound, NBTList } from '../mod.ts'

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

const j = JNBT.comp({
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

console.log(board);
console.log(j);
console.log(NBTHelper.jnbtToNBT(j));