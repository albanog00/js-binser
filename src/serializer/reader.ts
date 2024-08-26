export class BinaryReader {
  private readonly buf: Buffer;
  private position_ptr = 0;

  constructor(buffer: Buffer) {
    this.buf = buffer;
  }

  public readUInt8(): number {
    const val = this.buf.readUInt8(this.position_ptr);
    this.position_ptr += 1;
    return val;
  }

  public readUInt16BE(): number {
    const val = this.buf.readUInt16BE(this.position_ptr);
    this.position_ptr += 2;
    return val;
  }

  public readUInt32BE(): number {
    const val = this.buf.readUInt32BE(this.position_ptr);
    this.position_ptr += 4;
    return val;
  }

  public readInt8(): number {
    const val = this.buf.readInt8(this.position_ptr);
    this.position_ptr += 1;
    return val;
  }

  public readInt16BE(): number {
    const val = this.buf.readInt16BE(this.position_ptr);
    this.position_ptr += 2;
    return val;
  }

  public readInt32BE(): number {
    const val = this.buf.readInt32BE(this.position_ptr);
    this.position_ptr += 4;
    return val;
  }

  public readBoolean(): boolean {
    const val = this.buf.readUInt8(this.position_ptr) == 1;
    this.position_ptr += 1;
    return val;
  }

  public readString(size: number): string {
    if (this.position_ptr + size > this.buf.length)
      throw new Error(`Trying to read out of the bound of the buffer.`);

    const val = this.buf.toString(
      "utf-8",
      this.position_ptr,
      this.position_ptr + size,
    );
    this.position_ptr += size;
    return val;
  }
}
