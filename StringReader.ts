// Base on: https://github.com/Mojang/brigadier/blob/master/src/main/java/com/mojang/brigadier/StringReader.java
import { StringBuilder } from './StringBuilder.ts';

export class StringReader {
  private static readonly SYNTAX_ESCAPE: string = '\\';
  private static readonly SYNTAX_DOUBLE_QUOTE: string = '"';
  private static readonly SYNTAX_SINGLE_QUOTE: string = '\'';
  private static readonly whitespaceCharacters = [' ', '  ', '\b', '\t', '\n', '\v', '\f', '\r', `\"`, `\'`, `\\`, '\u0008', '\u0009', '\u000A', '\u000B', '\u000C', '\u000D', '\u0020','\u0022', '\u0027', '\u005C', '\u00A0', '\u2028', '\u2029', '\uFEFF']

  private readonly string: string;
  private cursor: number = 0;

  public constructor(other: StringReader);
  public constructor(string: string);
  public constructor(string: string | StringReader) {
    if(string instanceof StringReader) {
      this.string = string.string;
      this.cursor = string.cursor;
    } else {
      this.string = string;
    }
  }

  public getString(): string {
    return this.string;
  }

  public setCursor(cursor: number): void {
    this.cursor = cursor;
  }

  public getRemainingLength(): number {
    return this.string.length - this.cursor;
  }

  public getTotalLength(): number {
    return this.string.length;
  }

  public getCursor(): number {
    return this.cursor;
  }

  public getRead(): string {
    return this.string.substring(0, this.cursor);
  }

  public getRemaining(): string {
    return this.string.substring(this.cursor);
  }

  public canRead(length: number = 1): boolean {
    return this.cursor + length <= this.string.length;
  }

  public peek(offset: number = 0): string {
    return this.string.charAt(this.cursor + offset);
  }

  public read(): string {
    return this.string.charAt(this.cursor++);
  }

  public skip(): void {
    this.cursor++;
  }

  public static isAllowedNumber(c: string): boolean {
    return (c >= '0' && c <= '9') || c == '.' || c == '-';
  }

  public static isQuotedStringStart(c: string): boolean {
    return c === StringReader.SYNTAX_DOUBLE_QUOTE || c === StringReader.SYNTAX_SINGLE_QUOTE;
  }

  public static isWhitespace(c: string): boolean {
    return StringReader.whitespaceCharacters.some(value => value === c)
  }

  public skipWhitespace(): void {
    while(this.canRead() && StringReader.isWhitespace(this.peek())) {
      this.skip();
    }
  }

  public readInt(): number {
    let start = this.cursor;
    while(this.canRead() && StringReader.isAllowedNumber(this.peek())) {
      this.skip();
    }

    let number = this.string.substring(start, this.cursor);
    if(number.length === 0) {
      throw new Error('Int Expected');
    }

    try {
      return parseInt(number);
    } catch (e) {
      this.cursor = start;
      throw new Error('Invalid Int')
    }
  }

  public readFloat(): number {
    let start = this.cursor;
    while(this.canRead() && StringReader.isAllowedNumber(this.peek())) {
      this.skip();
    }

    let number = this.string.substring(start, this.cursor);
    if(number.length === 0) {
      throw new Error('Float Expected');
    }

    try {
      return parseFloat(number);
    } catch (e) {
      this.cursor = start;
      throw new Error('Invalid Float')
    }
  }

  public readDouble(): number {
    let start = this.cursor;
    while(this.canRead() && StringReader.isAllowedNumber(this.peek())) {
      this.skip();
    }

    let number = this.string.substring(start, this.cursor);
    if(number.length === 0) {
      throw new Error('Double Expected');
    }

    try {
      return parseFloat(number);
    } catch (e) {
      this.cursor = start;
      throw new Error('Invalid Double')
    }
  }

  public readLong(): bigint {
    let start = this.cursor;
    while(this.canRead() && StringReader.isAllowedNumber(this.peek().replaceAll('n', ''))) {
      this.skip();
    }

    let number = this.string.substring(start, this.cursor).replaceAll('n', '');
    if(number.length === 0) {
      throw new Error('Long Expected');
    }

    try {
      return BigInt(parseFloat(number));
    } catch (e) {
      this.cursor = start;
      throw new Error('Invalid Long')
    }
  }

  public static isAllowedInUnquotedString(c: string): boolean {
    return (c >= '0' && c <= '9') || (c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z') || c == '_' || c == '-' || c == '.' || c == '+' || c == '#';
  }

  public readStringUntil(terminator: string): string {
    let result = new StringBuilder();
    let escaped = false;
    while(this.canRead()) {
      let c = this.read();
      if (escaped) {
        if (c == terminator || c == StringReader.SYNTAX_ESCAPE) {
          result.append(c);
          escaped = false;
        } else {
          this.setCursor(this.getCursor() - 1);
          throw new Error('Invalied escape');
        }
      } else if (c == StringReader.SYNTAX_ESCAPE) {
        escaped = true;
      } else if (c == terminator) {
        return result.toString();
      } else {
        result.append(c);
      }
    }

    throw new Error('End of quote expected');
  }

  public readUnquotedString(): string {
    let start = this.cursor;
    while(this.canRead() && StringReader.isAllowedInUnquotedString(this.peek())) {
      this.skip();
    }
    return this.string.substring(start, this.cursor);
  }

  public readQuotedString(): string {
    if(!this.canRead()) {
      return '';
    }
    let next = this.peek();
    if (!StringReader.isQuotedStringStart(next)) {
        throw new Error('Expected start of quote');
    }

    this.skip();
    return this.readStringUntil(next);
  }

  public readString(): string {
    if (!this.canRead()) {
      return '';
    }
    let next = this.peek();
 /*    if (StringBuilder.isQuotedStringStart(next)) {
      this.skip();
      return this.readStringUntil(next);
    } */
    return this.readUnquotedString();
  }

  public readBoolean(): boolean {
    let start = this.cursor;
    let value = this.readString();
    if (value.length === 0) {
        throw new Error('Boolean expected');
    }

    if (value === "true") {
        return true;
    } else if (value === "false") {
        return false;
    } else {
        this.cursor = start;
        throw new Error('Invalid boolean');
    }
  }

  public expect(c: string): void {
    if(!this.canRead() || this.peek() != c) {
      throw new Error('Expected symbol ' + c);
    }
    this.skip();
  }
}