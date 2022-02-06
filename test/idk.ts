import { JNBT, NBTHelper, NBTCompound, NBTList } from '../mod.ts'

// const s = '{"nestedcompoundtest":{ ham:{ name:"Hampus",value:0.75f},egg:{name:"Eggbert",value:0.5f }}}'
// console.log(NBTHelper.snbtToNBT(s))

const m = new NBTCompound()
m.putByte('isTrue', 1)
m.putInt('age', 146546)
m.putFloat('height', 1.71)
m.putDouble('pi', 3.1416948674676)
m.putLong('sunToEarth', 150000000n)
m.putString('name', 'KalmeMarq')
m.putByteArray('blocks', [0, 3, 1, 5, 7, 10, 20, 33, 12, 33])

console.log(NBTHelper.nbtToSNBT(m));


// const board = new NBTCompound()
// board.putInt('id', 351325)
// board.putString('name', 'Board Name')
// board.putInt('createdAt', Date.now())

// const lists = new NBTList()

// const list1 = new NBTCompound()
// list1.putInt('id', 446)
// list1.putString('name', 'To Do')

// lists.add(list1)

// board.put('lists', lists)

// const j = JNBT.comp({
//   id: JNBT.int(462346),
//   name: JNBT.string('Another Board'),
//   createdAt: JNBT.int(Date.now()),
//   lists: JNBT.list([
//     JNBT.comp({
//       id: JNBT.int(345),
//       name: JNBT.string('Done')
//     })
//   ])
// })

// console.log(board);
// console.log(j);
// console.log(NBTHelper.jnbtToNBT(j));