// import { NBTUtils, JNBT } from '../nbt/NBTUtils.ts'

// const nbt = NBTUtils.jnbtToNBT(JNBT.comp({
  //   name: JNBT.short(1),
  //   n: JNBT.string('fsdfsd'),
  //   f: JNBT.bool(true),
  //   fdgdsf: JNBT.long(45346346356n),
  //   nnd: JNBT.longArray([0n, 0n, 2n]),
  //   dg: JNBT.comp({
    //     s: JNBT.string('s')
    //   }),
    //   data: JNBT.list([JNBT.byte(2), JNBT.byte(0)])
    // }))
    
    // console.log(nbt);


// const c = await Deno.readFile('test/test_resources/level.dat')
// const n = NBTUtils.readCompressed(c)
    // console.log(NBTUtils.nbtToSNBT(n.getCompound('Data'), false, 'ansi'));
    // console.log(NBTUtils.nbt(n.getCompound('Data')));
    
// console.time('A')
// const n = NBTUtils.snbtToJNBT('{text:"Hey", age: 100L}')
// console.timeEnd('A')
// console.log(n)
    
    // for (let i = 0; i < 1000; i++) {
//   console.time('A')
//   console.timeEnd('A')
// }
// NBTHelper.nbtToTreeView(n)

// await Deno.writeTextFileSync('df.txt', escape('a'))

// const s = '{"nestedcompoundtest":{ ham:{ name:"Hampus",value:0.75f},egg:{name:"Eggbert",value:0.5f }}}'
// console.log(NBTHelper.snbtToNBT(s))

// class Chunk {
  
// }

// const data = await Deno.readFile('test/test_resources/r.0.-1.mca')
// const reader = new BinaryReader(data)

// const header = new Uint8Array(data.subarray(0, 8192))
// const sectorData = new Int32Array(header.subarray(0, 4096))
// const times = new Int32Array(header.subarray(4096, 8192))

// reader.setOffset(8192)
// console.log(reader.readUInt());
// console.log(reader.readByte());
// console.log(deflate(data.subarray(8192 + 1 + 4, 8192 + 1 + 4 + 4096)));


// console.log(NBTInt.TYPE.getTreeViewName());


// function getSize(data: number) {
//   return data & 0xFF;
// }

// function getOffset(data: number) {
//   return data >> 8 & 0xFFFFFF;
// }

// for (let i = 0; i < 1024; i++) {
//   const k = sectorData[i] as number;
//   if (k === 0) continue
//   const m = getOffset(k)
//   const n = getSize(k)

//   console.log(m, n);
  
// }


// const chunks: any[] = []

// function readThreeBytesInt(reader: BinaryReader) {
//   const b0 = reader.readByte()
//   const b1 = reader.readByte()
//   const b2 = reader.readByte()
//   const number = ((b0 & 0x0F) << 16) | ((b1 & 0xFF) << 8) | ((b2 & 0xFF))
//   return number
// }

// class RegionFile {
//   private x: number
//   private z: number

//   public constructor(buffer: Uint8Array, x: number, z: number) {
//     this.x = x
//     this.z = z
//   }

//   public getChunkOffset(x: number, z: number) {
//     return 4 * ((x % 32) + (z % 32) * 32)
//   }
// }


// console.log(new Int32Array(d, 0, 1024));


// for (let i = 0; i < 1024; i++) {
//   const offset = reader.readInt32BE()
//   console.log(offset);
  
//   // chunks[i] = {}
//   // chunks[i].relX = i % 32;
//   // chunks[i].relZ = Math.floor(i / 32.0);
//   // chunks[i].offset = offset
// }

// // for (let i = 0; i < 1024; i++) {
// //   chunks[i].lastChange = reader.readInt()
// // }

// console.log(chunks);


// const c = NBTHelper.readCompressed(d)


// console.log(c);


// const reader = new BinaryReader(d)

// const locations = new Array(4096)
// reader.readFully(locations)

// const timestamps = new Array(4096)
// reader.readFully(timestamps)

// function chunkDataLocation(x: number, z: number) {
//   return (x % 32 + (z % 32) * 32) * 4;
// }

// function ChunkSize(x: number, z: number) {
//   const location = chunkDataLocation(x, z);
//   return 4096 * locations[location + 3];
// }

// function ChunkOffset(x: number, z: number) {
//   const location = chunkDataLocation(x, z);
//   const four = new Array(4);
//   Array.Copy(locations, location, four, 1, 3);
  
  
//   return 4096 * DataUtils.ToInt32(four);
// }

// console.log(timestamps);

// const m = new NBTCompound()
// m.putByte('isTrue', 1)
// m.putInt('age', -146546)
// m.putFloat('height', 1.71)
// m.putDouble('pi', 3.1416948674676)
// m.putLong('sunToEarth', 150000000n)
// m.putString('name', 'KalmeMarq')
// m.putShort('nams', -20)

// const d = NBTHelper.write(m)
// const d = await Deno.readFile('test/test_resources/test10.nbt')
// const m = NBTHelper.read(d)
// // m.putByteArray('blocks', [0, 3, 1, 5, 7, 10, 20, 33, 12, 33])

// console.log(NBTHelper.nbtToSNBT(m, false, 'ansi'));


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