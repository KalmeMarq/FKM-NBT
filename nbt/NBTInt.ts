import BinaryReader from '../utils/BinaryReader.ts'
import BinaryWriter from '../utils/BinaryWriter.ts'
import { NBTElement } from './NBTElement.ts'
import { NBTNumber } from "./NBTNumber.ts";
import { NBTType } from "./NBTType.ts";
import { NBTVisitor } from "./NBTVisitor.ts";
import { StringNBTWriter } from "./StringNBTWriter.ts";

export class NBTInt extends NBTNumber {
  private value: number

  public constructor(value?: number) {
      super()
      this.value = value ?? 0
  }

  public static of(value: number): NBTInt {
    return new NBTInt(value)
  }

  public override getType(): number {
    return 3
  }

  public write(writer: BinaryWriter): void {
    writer.writeInt(this.value)
  }

  public acceptWriter(visitor: NBTVisitor): void {
    visitor.visitInt(this)
  }

  public static TYPE: NBTType<NBTInt> = new class extends NBTType<NBTInt> {
    public read<NBTInt>(reader: BinaryReader): NBTInt {
      return NBTInt.of(reader.readInt()) as unknown as NBTInt
    }
  
    public getTreeViewName(): string {
      return 'TAG_Int'
    }
  }

  public getNBTType(): NBTType<NBTInt> {
    return NBTInt.TYPE
  }
  
  public byteValue(): number {
    return this.value & 0xFF
  }

  public shortValue(): number {
    return this.value & 0xFFFF
  }

  public intValue(): number {
    return this.value
  }

  public floatValue(): number {
    return this.value
  }

  public doubleValue(): number {
    return this.value
  }

  public longValue(): bigint {
    return BigInt(this.value)
  }

  public numberValue(): number {
    return this.value
  }

  public asString(): string {
    return new StringNBTWriter().apply(this)
  }

  /** @deprecated */
  public static reader = {
    read<NBTInt>(reader: BinaryReader): NBTInt {
      return NBTInt.of(reader.readInt()) as unknown as NBTInt
    }
  }
}