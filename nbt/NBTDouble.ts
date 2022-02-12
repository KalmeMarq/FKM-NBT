import BinaryReader from '../utils/BinaryReader.ts'
import BinaryWriter from '../utils/BinaryWriter.ts'
import { NBTNumber } from './NBTNumber.ts'
import { NBTType } from './NBTType.ts'
import { NBTVisitor } from "./NBTVisitor.ts";
import { StringNBTWriter } from "./StringNBTWriter.ts";

export class NBTDouble extends NBTNumber {
  private value: number

  public constructor(value?: number) {
      super()
      this.value = value ?? 0
  }

  public static of(value: number): NBTDouble {
    return new NBTDouble(value)
  }

  public override getType(): number {
    return 6
  }

  public write(writer: BinaryWriter): void {
    writer.writeDouble(this.value)
  }

  public acceptWriter(visitor: NBTVisitor): void {
    visitor.visitDouble(this)
  }

  public static TYPE: NBTType<NBTDouble> = new class extends NBTType<NBTDouble> {
    public read<NBTDouble>(reader: BinaryReader): NBTDouble {
      return NBTDouble.of(reader.readDouble()) as unknown as NBTDouble
    }
  
    public getTreeViewName(): string {
      return 'TAG_Float'
    }
  }

  public getNBTType(): NBTType<NBTDouble> {
    return NBTDouble.TYPE
  }
  
  public byteValue(): number {
    return Math.floor(this.value) & 0xFF
  }

  public shortValue(): number {
    return Math.floor(this.value) & 0xFFFF
  }

  public intValue(): number {
    return Math.floor(this.value)
  }

  public floatValue(): number {
    return this.value
  }

  public doubleValue(): number {
    return this.value
  }

  public longValue(): bigint {
    return BigInt(Math.floor(this.value))
  }

  public numberValue(): number {
    return this.value
  }

  public asString(): string {
    return new StringNBTWriter().apply(this)
  }

  /** @deprecated */
  public static reader = {
    read<NBTDouble>(reader: BinaryReader): NBTDouble {
      return NBTDouble.of(reader.readDouble()) as unknown as NBTDouble
    }
  }
}