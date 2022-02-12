import BinaryReader from '../utils/BinaryReader.ts'
import { NBTElement } from './NBTElement.ts'

export abstract class NBTTypeReader<T = NBTElement> {
  abstract read(reader: BinaryReader): T
}