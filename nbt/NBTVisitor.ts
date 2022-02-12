import { NBTByte } from './NBTByte.ts'
import { NBTByteArray } from './NBTByteArray.ts'
import { NBTCompound } from './NBTCompound.ts'
import { NBTDouble } from './NBTDouble.ts'
import { NBTFloat } from './NBTFloat.ts'
import { NBTInt } from './NBTInt.ts'
import { NBTIntArray } from './NBTIntArray.ts'
import { NBTList } from './NBTList.ts'
import { NBTLong } from './NBTLong.ts'
import { NBTLongArray } from './NBTLongArray.ts'
import { NBTNull } from './NBTNull.ts'
import { NBTShort } from './NBTShort.ts'
import { NBTString } from './NBTString.ts'

export interface NBTVisitor {
  visitString(tag: NBTString): void
  visitByte(tag: NBTByte): void
  visitShort(tag: NBTShort): void
  visitInt(tag: NBTInt): void
  visitLong(tag: NBTLong): void
  visitFloat(tag: NBTFloat): void
  visitDouble(tag: NBTDouble): void
  visitByteArray(tag: NBTByteArray): void
  visitIntArray(tag: NBTIntArray): void
  visitLongArray(tag: NBTLongArray): void
  visitList(tag: NBTList): void
  visitCompound(tag: NBTCompound): void
  visitNull(tag: NBTNull): void
}