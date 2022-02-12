import BinaryReader from '../utils/BinaryReader.ts'
import BinaryWriter from '../utils/BinaryWriter.ts'
import { StringBuilder } from "../utils/StringBuilder.ts";
import { NBTElement } from './NBTElement.ts'
import { NBTType } from "./NBTType.ts";
import { NBTVisitor } from "./NBTVisitor.ts";
import { StringNBTWriter } from "./StringNBTWriter.ts";

export class NBTString extends NBTElement {
  private value: string

  public constructor(value?: string) {
      super()
      this.value = value ?? ''
  }

  public static of(value: string): NBTString {
      return new NBTString(value)
  }

  public override getType(): number {
    return 8
  }

  public write(writer: BinaryWriter): void {
    writer.writeString(this.value)
  }

  public acceptWriter(visitor: NBTVisitor): void {
    visitor.visitString(this)
  }

  public static TYPE: NBTType<NBTString> = new class extends NBTType<NBTString> {
    public read<NBTString>(reader: BinaryReader): NBTString {
      return NBTString.of(reader.readString()) as unknown as NBTString
    }
  
    public getTreeViewName(): string {
      return 'TAG_String'
    }
  }

  public getNBTType(): NBTType<NBTString> {
    return NBTString.TYPE
  }

  public asString(): string {
    return this.value
  }

  public static skip(reader: BinaryReader): void {
    reader.skipBytes(reader.readUShort())
  }

  public static escape(value: string): string {
    const stringBuilder = new StringBuilder(" ")
    let c: string = ''
    for (let i = 0; i < value.length; ++i) {
        let d = value.charAt(i)
        if (d == '\\') {
            stringBuilder.append('\\')
        } else if (d == '"' || d == "'") {
            if (c == '') c = d == '"' ? "'" : '"'
            if (c == d) stringBuilder.append('\\')
        }

        stringBuilder.append(d)
    }

    if (c == '') c = '"'

    stringBuilder.setCharAt(0, c)
    stringBuilder.append(c)
    return stringBuilder.toString()
  }

  /** @deprecated */
  public static reader = {
    read<NBTString>(reader: BinaryReader): NBTString {
      return NBTString.of(reader.readString()) as unknown as NBTString
    }
  }
}