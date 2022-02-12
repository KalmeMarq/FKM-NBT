import BinaryReader from '../utils/BinaryReader.ts'
import BinaryWriter from '../utils/BinaryWriter.ts'
import { NBTType } from "./NBTType.ts";
import { NBTVisitor } from "./NBTVisitor.ts";
import { StringNBTWriter } from "./StringNBTWriter.ts";

export abstract class NBTElement {
  abstract getType(): number

  abstract write(writer: BinaryWriter): void

  static reader: { read: <T extends NBTElement>(reader: BinaryReader) => T }

  abstract getNBTType(): NBTType<NBTElement>

  abstract acceptWriter(visitor: NBTVisitor): void

  abstract asString(): string
}