import { BinaryReader } from "../mod.ts";
import BinaryWriter from '../utils/BinaryWriter.ts'
import { NBTElement } from './NBTElement.ts'
import { NBTType } from "./NBTType.ts";
import { NBTVisitor } from "./NBTVisitor.ts";
import { StringNBTWriter } from "./StringNBTWriter.ts";

export class NBTNull extends NBTElement {
  public constructor() {
    super()
  }

  public getType(): number {
    return 0
  }

  public write(_writer: BinaryWriter): void {
  }

  public acceptWriter(visitor: NBTVisitor): void {
    visitor.visitNull(this)
  }

  public static TYPE: NBTType<NBTNull> = new class extends NBTType<NBTNull> {
    public read<NBTNull>(_reader: BinaryReader): NBTNull {
      return new NBTNull() as unknown as NBTNull
    }
  
    public getTreeViewName(): string {
      return 'TAG_Int'
    }
  }

  public getNBTType(): NBTType<NBTNull> {
    return NBTNull.TYPE
  }

  public asString(): string {
    return new StringNBTWriter().apply(this)
  }
}