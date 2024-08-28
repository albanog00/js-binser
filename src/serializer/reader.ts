export class BinaryReader {
  private readonly buf: DataView;
  private position_ptr = 0;

  constructor(buffer: Buffer) {
    this.buf = new DataView(buffer.buffer);
  }

  public readUInt8(): number {
    const val = this.buf.getUint8(this.position_ptr);
    this.position_ptr += 1;
    return val;
  }

  public readUInt16BE(): number {
    const val = this.buf.getUint16(this.position_ptr);
    this.position_ptr += 2;
    return val;
  }

  public readUInt32BE(): number {
    const val = this.buf.getUint32(this.position_ptr);
    this.position_ptr += 4;
    return val;
  }

  public readInt8(): number {
    const val = this.buf.getInt8(this.position_ptr);
    this.position_ptr += 1;
    return val;
  }

  public readInt16BE(): number {
    const val = this.buf.getInt16(this.position_ptr);
    this.position_ptr += 2;
    return val;
  }

  public readInt32BE(): number {
    const val = this.buf.getInt32(this.position_ptr);
    this.position_ptr += 4;
    return val;
  }

  public readBoolean(): boolean {
    const val = this.buf.getUint8(this.position_ptr) == 1;
    this.position_ptr += 1;
    return val;
  }

  public readString(size: number): string {
    const end_position = this.position_ptr + size;
    if (end_position > this.buf.buffer.byteLength)
      throw new Error(`Trying to read out of the bound of the buffer.`);

    const string_buffer = new Array<string>(size);
    for (let i = 0; i < size; ++i) {
      string_buffer[i] = String.fromCharCode(this.readUInt8());
    }

    return string_buffer.join("");
  }
}
