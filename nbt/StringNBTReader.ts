import { StringReader } from "../StringReader.ts"
import { NBTByte } from "./NBTByte.ts";
import { NBTByteArray } from "./NBTByteArray.ts";
import { NBTCompound } from "./NBTCompound.ts"
import { NBTDouble } from "./NBTDouble.ts";
import { NBTElement } from "./NBTElement.ts"
import { NBTFloat } from "./NBTFloat.ts";
import { NBTInt } from "./NBTInt.ts";
import { NBTIntArray } from "./NBTIntArray.ts";
import { NBTList } from "./NBTList.ts";
import { NBTLong } from "./NBTLong.ts";
import { NBTLongArray } from "./NBTLongArray.ts";
import { NBTShort } from "./NBTShort.ts";
import { NBTString } from "./NBTString.ts";

export class StringNBTReader {
  private static DOUBLE_PATTERN_IMPLICIT: RegExp = /[-+]?(?:[0-9]+[.]|[0-9]*[.][0-9]+)(?:e[-+]?[0-9]+)?/i
  private static DOUBLE_PATTERN: RegExp = /[-+]?(?:[0-9]+[.]?|[0-9]*[.][0-9]+)(?:e[-+]?[0-9]+)?d/i
  private static FLOAT_PATTERN: RegExp = /[-+]?(?:[0-9]+[.]?|[0-9]*[.][0-9]+)(?:e[-+]?[0-9]+)?f/i
  private static BYTE_PATTERN: RegExp = /[-+]?(?:0|[1-9][0-9]*)b/i
  private static LONG_PATTERN: RegExp = /[-+]?(?:0|[1-9][0-9]*)l/i
  private static SHORT_PATTERN: RegExp = /[-+]?(?:0|[1-9][0-9]*)s/i
  private static INT_PATTERN: RegExp = /[-+]?(?:0|[1-9][0-9]*)"/

  public static read(text: string): NBTCompound {
    return new StringNBTReader(new StringReader(text)).readCompound()
  }

  private reader: StringReader
  private constructor(reader: StringReader) {
    this.reader = reader
  }

  public readCompound(): NBTCompound {
    const comp = this.parseCompound()
    return comp
  }

  private parseCompound(): NBTCompound {
    this.expect('{')
    const compound = new NBTCompound()
    this.reader.skipWhitespace()
    
    while (this.reader.canRead() && this.reader.peek() !== '}') {
      const i = this.reader.getCursor()
      const str = this.reader.readString()
      if (str.length < 1) {
        this.reader.setCursor(i)
        throw new SyntaxError('Expected key')
      }

      this.expect(':')

      compound.put(str, this.parseElement())
      if (!this.readComma()) break
      if (this.reader.canRead()) continue
      throw new SyntaxError('Expected key')
    }

    this.expect('}')
    return compound
  }

  public parseElement(): NBTElement {
    this.reader.skipWhitespace()
    if (!this.reader.canRead()) {
        throw new SyntaxError('Expected value')
    }
    const c = this.reader.peek()
    if (c == '{') {
        return this.parseCompound()
    }
    if (c == '[') {
        return this.parseArray()
    }
    return this.parseElementPrimitive()
  }

  protected parseArray(): NBTElement {
    if (this.reader.canRead(3) && !StringReader.isQuotedStringStart(this.reader.peek(1)) && this.reader.peek(2) == ';') {
        return this.parseElementPrimitiveArray()
    }
    return this.parseList()
  }

  private parseElementPrimitiveArray(): NBTElement {
    this.expect('[');
    const i = this.reader.getCursor();
    const c = this.reader.read();
    this.reader.read();
    this.reader.skipWhitespace();
    if (!this.reader.canRead()) {
        throw new SyntaxError('Expected value')
    }
    if (c == 'B') {
        return new NBTByteArray(this.readArray(NBTByteArray, NBTByte));
    }
    if (c == 'L') {
        return new NBTLongArray(this.readArray(NBTLongArray, NBTLong));
    }
    if (c == 'I') {
        return new NBTIntArray(this.readArray(NBTIntArray, NBTInt));
    }
    this.reader.setCursor(i);
    throw new Error('Array type is not allowed')
  }

  private readArray<T extends number | bigint>(arrayTypeReader: any, typeReader: any): T[] {
    const list: T[] = [];
    while (this.reader.peek() != ']') {
        const i = this.reader.getCursor();
        const nbtElement = this.parseElement();
        const nbtType = nbtElement.getType();
        // if (nbtType !== typeReader) {
        //     this.reader.setCursor(i);
        //     throw ARRAY_MIXED.createWithContext(this.reader, nbtType.getCommandFeedbackName(), arrayTypeReader.getCommandFeedbackName());
        // }
        if (typeReader == NBTByte) {
            list.push((nbtElement as any).byteValue());
        } else if (typeReader == NBTLong) {
            list.push((nbtElement as any).longValue());
        } else {
            list.push((nbtElement as any).intValue());
        }
        if (!this.readComma()) break;
        if (this.reader.canRead()) continue;
        throw new SyntaxError('Expected value')
    }
    this.expect(']');
    return list
}

  private parseList(): NBTElement {
    this.expect('[')
    this.reader.skipWhitespace()
    if (!this.reader.canRead()) {
        throw new SyntaxError('Expected value')
    }
    const list: NBTElement[] = [];
    let nbtType: number | null = null;
    while (this.reader.peek() != ']') {
        const i = this.reader.getCursor();
        const nbtElement = this.parseElement();
        const nbtType2 = nbtElement.getType();
        if (nbtType == null) {
            nbtType = nbtType2;
        } else if (nbtType2 != nbtType) {
            this.reader.setCursor(i);
            throw new Error('List has multiple types. It should only have one.')
        }
        list.push(nbtElement);
        if (!this.readComma()) break;
        if (this.reader.canRead()) continue;
        throw new SyntaxError('Expected value')
    }
    this.expect(']');
    return new NBTList(list, nbtType ?? 0);
  }

  protected parseElementPrimitive(): NBTElement {
    this.reader.skipWhitespace()
    const i = this.reader.getCursor()
    if (StringReader.isQuotedStringStart(this.reader.peek())) {
        return NBTString.of(this.reader.readQuotedString())
    }
    const str = this.reader.readUnquotedString()
    if (str.length < 1) {
        this.reader.setCursor(i)
        throw new SyntaxError('Expected value')
    }
    return this.parsePrimitive(str)
  }

  private parsePrimitive(input: string): NBTElement {
    try {
        if (StringNBTReader.FLOAT_PATTERN.test(input)) {
            return NBTFloat.of(parseFloat(input.substring(0, input.length - 1)));
        }
        if (StringNBTReader.BYTE_PATTERN.test(input)) {
            return NBTByte.of(parseInt(input.substring(0, input.length - 1)));
        }
        if (StringNBTReader.LONG_PATTERN.test(input)) {
            return NBTLong.of(BigInt(input.substring(0, input.length - 1)));
        }
        if (StringNBTReader.SHORT_PATTERN.test(input)) {
            return NBTShort.of(parseInt(input.substring(0, input.length - 1)));
        }
        if (StringNBTReader.INT_PATTERN.test(input)) {
            return NBTInt.of(parseInt(input));
        }
        if (StringNBTReader.DOUBLE_PATTERN.test(input)) {
            return NBTDouble.of(parseFloat(input.substring(0, input.length - 1)));
        }
        if (StringNBTReader.DOUBLE_PATTERN_IMPLICIT.test(input)) {
            return NBTDouble.of(parseFloat(input));
        }
        if ("true" === input.toLowerCase()) {
            return new NBTByte(1);
        }
        if ("false" === input.toLowerCase()) {
            return new NBTByte(0);
        }
    }
    catch (e) {}

    return NBTString.of(input);
  }

  private readComma(): boolean {
    this.reader.skipWhitespace()
    if (this.reader.canRead() && this.reader.peek() == ',') {
        this.reader.skip()
        this.reader.skipWhitespace()
        return true
    }
    return false
  }

  private expect(char: string): void {
    this.reader.skipWhitespace()
    this.reader.expect(char)
  }
}