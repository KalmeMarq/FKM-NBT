import { StringBuilder } from "../utils/StringBuilder.ts";
import { NBTByte } from './NBTByte.ts'
import { NBTByteArray } from './NBTByteArray.ts'
import { NBTCompound } from './NBTCompound.ts'
import { NBTDouble } from './NBTDouble.ts'
import { NBTElement } from "./NBTElement.ts";
import { NBTFloat } from './NBTFloat.ts'
import { NBTInt } from './NBTInt.ts'
import { NBTIntArray } from './NBTIntArray.ts'
import { NBTList } from './NBTList.ts'
import { NBTLong } from './NBTLong.ts'
import { NBTLongArray } from './NBTLongArray.ts'
import { NBTNull } from './NBTNull.ts'
import { NBTShort } from './NBTShort.ts'
import { NBTString } from './NBTString.ts'
import { NBTVisitor } from './NBTVisitor.ts'

export class TreeViewNBTWriter implements NBTVisitor {
  private result = new StringBuilder()
  private currKey: string = "''"
  private depth: number = 0
  
  public apply(tag: NBTElement): string {
    tag.acceptWriter(this)
    return this.result.toString()
  }

  public setDepth(depth: number): TreeViewNBTWriter {
    this.depth = depth
    return this
  }

  public setCurrKey(key: string): TreeViewNBTWriter {
    this.currKey = key
    return this
  }

  public visitString(tag: NBTString): void {
    this.result.append(tag.getNBTType().getTreeViewName()).append(`(${this.currKey})`).append(`: '${tag.asString()}'`)
  }
  
  public visitByte(tag: NBTByte): void {
    this.result.append(tag.getNBTType().getTreeViewName()).append(`(${this.currKey})`).append(`: ${tag.numberValue()}`)
  }
  
  public visitShort(tag: NBTShort): void {
    this.result.append(tag.getNBTType().getTreeViewName()).append(`(${this.currKey})`).append(`: ${tag.numberValue()}`)
  }
  
  public visitInt(tag: NBTInt): void {
    this.result.append(tag.getNBTType().getTreeViewName()).append(`(${this.currKey})`).append(`: ${tag.numberValue()}`)
  }
  
  public visitLong(tag: NBTLong): void {
    this.result.append(tag.getNBTType().getTreeViewName()).append(`(${this.currKey})`).append(`: ${tag.longValue()}`)
  }
  
  public visitFloat(tag: NBTFloat): void {
    this.result.append(tag.getNBTType().getTreeViewName()).append(`(${this.currKey})`).append(`: ${tag.numberValue()}`)
  }
  
  public visitDouble(tag: NBTDouble): void {
    this.result.append(tag.getNBTType().getTreeViewName()).append(`(${this.currKey})`).append(`: ${tag.numberValue()}`)
  }
  
  public visitByteArray(tag: NBTByteArray): void {
    this.result.append(tag.getNBTType().getTreeViewName()).append(`(${this.currKey})`).append(`: ${tag.size()} ${this.entryPlural(tag.size())}\n`)
    this.result.append('  '.repeat(this.depth)).append('{')

    const bs = tag.getByteArray()
    if (bs.length > 0) this.result.append('\n')
    for (let i = 0; i < bs.length; i++) {
      if (i !== 0) this.result.append('\n')
      
      this.result.append('  '.repeat(this.depth + 1)).append(`${NBTByte.TYPE.getTreeViewName()}(None): `).append(bs[i])
    }

    this.result.append('\n').append('  '.repeat(this.depth)).append('}')
  }
  
  public visitIntArray(tag: NBTIntArray): void {
    this.result.append(tag.getNBTType().getTreeViewName()).append(`(${this.currKey})`).append(`: ${tag.size()} ${this.entryPlural(tag.size())}\n`)
    this.result.append('  '.repeat(this.depth)).append('{')

    const is = tag.getIntArray()
    if (is.length > 0) this.result.append('\n')
    for (let i = 0; i < is.length; i++) {
      if (i !== 0) this.result.append('\n')
      
      this.result.append('  '.repeat(this.depth + 1)).append(`${NBTInt.TYPE.getTreeViewName()}(None): `).append(is[i])
    }

    this.result.append('\n').append('  '.repeat(this.depth)).append('}')
  }
  
  public visitLongArray(tag: NBTLongArray): void {
    this.result.append(tag.getNBTType().getTreeViewName()).append(`(${this.currKey})`).append(`: ${tag.size()} ${this.entryPlural(tag.size())}\n`)
    this.result.append('  '.repeat(this.depth)).append('{')

    const ls = tag.getLongArray()
    if (ls.length > 0) this.result.append('\n')
    for (let i = 0; i < ls.length; i++) {
      if (i !== 0) this.result.append('\n')
      
      this.result.append('  '.repeat(this.depth + 1)).append(`${NBTLong.TYPE.getTreeViewName()}(None): `).append(ls[i])
    }

    this.result.append('\n').append('  '.repeat(this.depth)).append('}')
  }
  
  public visitList(tag: NBTList): void {
    this.result.append(tag.getNBTType().getTreeViewName()).append(`(${this.currKey})`).append(`: ${tag.size()} ${this.entryPlural(tag.size())}\n`)
    this.result.append('  '.repeat(this.depth)).append('{').append(tag.size() > 0 ? '\n' : '')

    for (let i = 0; i < tag.size(); i++) {
      if (i !== 0) this.result.append('\n')
      this.result.append('  '.repeat(this.depth + 1)).append(new TreeViewNBTWriter().setCurrKey('None').setDepth(this.depth + 1).apply(tag.get(i)))
    }

    this.result.append('\n').append('  '.repeat(this.depth)).append('}')
  }
  
  public visitCompound(tag: NBTCompound): void {
    const keys = tag.getKeys()

    this.result.append(tag.getNBTType().getTreeViewName()).append(`(${this.currKey})`).append(`: ${keys.length} ${this.entryPlural(keys.length)}\n`)
    this.result.append('  '.repeat(this.depth)).append('{')
    for (const key of keys) {
      this.result.append('\n').append('  '.repeat(this.depth + 1))
      this.result.append(new TreeViewNBTWriter().setDepth(this.depth + 1).setCurrKey(`'${key}'`).apply(tag.get(key)))
    }
    this.result.append('\n').append('  '.repeat(this.depth)).append('}')
  }
  
  public visitNull(tag: NBTNull): void {
  }

  private entryPlural(size: number): string {
    return size === 1 ? 'entry' : 'entries'
  }
}