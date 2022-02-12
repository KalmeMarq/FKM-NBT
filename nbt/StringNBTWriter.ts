import { StringBuilder } from '../utils/StringBuilder.ts'
import { NBTString } from './NBTString.ts'
import { NBTByte } from './NBTByte.ts'
import { NBTShort } from './NBTShort.ts'
import { NBTInt } from './NBTInt.ts'
import { NBTLong } from './NBTLong.ts'
import { NBTFloat } from './NBTFloat.ts'
import { NBTDouble } from './NBTDouble.ts'
import { NBTByteArray } from './NBTByteArray.ts'
import { NBTIntArray } from './NBTIntArray.ts'
import { NBTLongArray } from './NBTLongArray.ts'
import { NBTNull } from './NBTNull.ts'
import { NBTCompound } from './NBTCompound.ts'
import { NBTList } from './NBTList.ts'
import { NBTElement } from "./NBTElement.ts";
import { NBTVisitor } from "./NBTVisitor.ts";

export class Style {
  public static BLACK = new Style('§0', '\u001b[30m')
  public static DARK_BLUE = new Style('§1', '\u001b[34m')
  public static DARK_GREEN = new Style('§2', '\u001b[32m')
  public static DARK_AQUA = new Style('§3', '\u001b[36m')
  public static DARK_RED = new Style('§4', '\u001b[31m')
  public static DARK_PURPLE = new Style('§5', '\u001b[35m')
  public static GOLD = new Style('§6', '\u001b[33m')
  public static GRAY = new Style('§7', '\u001b[37m')
  public static DARK_GRAY = new Style('§8', '\u001b[90m')
  public static BLUE = new Style('§9', '\u001b[94m')
  public static GREEN = new Style('§a', '\u001b[92m')
  public static AQUA = new Style('§b', '\u001b[96m')
  public static RED = new Style('§c', '\u001b[91m')
  public static LIGHT_PURPLE = new Style('§d', '\u001b[95m')
  public static YELLOW = new Style('§e', '\u001b[93m')
  public static WHITE = new Style('§f', '\u001b[97m')
  public static BOLD = new Style('§l', '\u001b[1m')
  public static ITALIC = new Style('§o', '\u001b[3m')
  public static UNDERLINED = new Style('§n', '\u001b[4m')
  public static STRIKETHROUGH = new Style('§m', '\u001b[9m')
  public static OBFUSCATED = new Style('§k', '\u001b[6m')
  public static RESET = new Style('§r', '\u001b[0m')

  private motd: string
  private ansi: string

  private constructor(motd: string, ansi: string) {
    this.motd = motd
    this.ansi = ansi
  }

  public getMotd(): string {
    return this.motd
  }

  public getAnsi(): string {
    return this.ansi
  }
}

export class StringNBTWriter implements NBTVisitor {
  private static SIMPLE_NAME: RegExp = /[A-Za-z0-9._+-]+/
  private result = new StringBuilder()
  private prettify: boolean
  private depth: number = 0
  private colorType: number = 0

  public constructor(prettify: boolean = false, colorType: number = 0) {
    this.prettify = prettify
    this.colorType = colorType
  }

  private style(name: Style): string {
    if (this.colorType === 0) {
      return ''
    } else if (this.colorType === 1) {
      return name.getMotd()
    } else {
      return name.getAnsi()
    }
  }

  public apply(tag: NBTElement): string {
    tag.acceptWriter(this)
    return this.result.toString()
  }

  public setDepth(depth: number): StringNBTWriter {
    this.depth = depth
    return this
  }

  public visitByte(tag: NBTByte): void {
    this.result.append(`${this.style(Style.GOLD)}${tag.numberValue()}`).append(`${this.style(Style.RED)}b${this.style(Style.RESET)}`)
  }

  public visitShort(tag: NBTShort): void {
    this.result.append(`${this.style(Style.GOLD)}${tag.numberValue()}`).append(`${this.style(Style.RED)}s${this.style(Style.RESET)}`)
  }

  public visitInt(tag: NBTInt): void {
    this.result.append(`${this.style(Style.GOLD)}${tag.numberValue()}${this.style(Style.RESET)}`)
  }

  public visitLong(tag: NBTLong): void {
    this.result.append(`${this.style(Style.GOLD)}${tag.numberValue()}`).append(`${this.style(Style.RED)}L${this.style(Style.RESET)}`)
  }

  public visitFloat(tag: NBTFloat): void {
    this.result.append(`${this.style(Style.GOLD)}${tag.numberValue()}`).append(`${this.style(Style.RED)}f${this.style(Style.RESET)}`)
  }

  public visitDouble(tag: NBTDouble): void {
    this.result.append(`${this.style(Style.GOLD)}${tag.numberValue()}`).append(`${this.style(Style.RED)}d${this.style(Style.RESET)}`)
  }

  public visitByteArray(tag: NBTByteArray): void {
    const type = `${this.style(Style.RED)}B${this.style(Style.RESET)}`

    this.result.append(`[${type};`)
    const bs = tag.getByteArray()
    for (let i = 0; i < bs.length; i++) {
      if (i !== 0) this.result.append(',').append(this.prettify ? ' ' : '')
      
      this.result.append(`${this.style(Style.GOLD)}${bs[i]}`).append(`${this.style(Style.RED)}B${this.style(Style.RESET)}`)
    }

    this.result.append(']')
  }

  public visitIntArray(tag: NBTIntArray): void {
    const type = `${this.style(Style.RED)}I${this.style(Style.RESET)}`

    this.result.append(`[${type};`)
    const is = tag.getIntArray()
    for (let i = 0; i < is.length; i++) {
      if (i !== 0) this.result.append(',').append(this.prettify ? ' ' : '')
      this.result.append(`${this.style(Style.GOLD)}${is[i]}${this.style(Style.RESET)}`)
    }

    this.result.append(']')
  }

  public visitLongArray(tag: NBTLongArray): void {
    const type = `${this.style(Style.RED)}L${this.style(Style.RESET)}`

    this.result.append(`[${type};`)
    const ls = tag.getLongArray()
    for (let i = 0; i < ls.length; i++) {
      if (i !== 0) {
        this.result.append(',').append(this.prettify ? ' ' : '')
      }
      this.result.append(`${this.style(Style.GOLD)}${ls[i]}`).append(type)
    }

    this.result.append(']')
  }

  public visitList(tag: NBTList): void {
    this.result.append('[')
    if (this.prettify) this.result.append('\n').append('  '.repeat(this.depth + 1))

    for (let i = 0; i < tag.size(); i++) {
      if (i !== 0) this.result.append(',').append(this.prettify ? '\n' + '  '.repeat(this.depth + 1) : '')
      this.result.append(new StringNBTWriter(this.prettify, this.colorType).setDepth(this.depth + 1).apply(tag.get(i)))
    }

    if (this.prettify) this.result.append('\n').append('  '.repeat(this.depth))
    this.result.append(']')
  }

  public visitCompound(tag: NBTCompound): void {
    this.result.append('{')
    if (this.prettify) this.result.append('\n')

    const keys = tag.getKeys().sort()
    let c = false
    for (const key of keys) {
      if (c) {
        this.result.append(',')
        if (this.prettify) this.result.append('\n')
      }
      if (this.prettify) this.result.append('  '.repeat(this.depth + 1))
      this.result.append(`${this.style(Style.AQUA)}${key}${this.style(Style.RESET)}`).append(':').append(this.prettify ? ' ' : '').append(new StringNBTWriter(this.prettify, this.colorType).setDepth(this.depth + 1).apply(tag.get(key)))
      c = true
    }

    if (this.prettify) this.result.append('\n').append('  '.repeat(this.depth))
    this.result.append('}')
  }

  public visitString(tag: NBTString): void {
    const es = NBTString.escape(tag.asString())
    this.result.append(`${es[0]}${this.style(Style.GREEN)}${es.substring(1, es.length - 1)}${this.style(Style.RESET)}${es[es.length - 1]}`)
  }

  public visitNull(_tag: NBTNull): void {
    this.result.append("END");
  }

  public static escapeName(name: string): string {
    if (StringNBTWriter.SIMPLE_NAME.test(name)) {
        return name
    }
    return NBTString.escape(name)
  }
}