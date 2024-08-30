import assert = require("assert");

const MAX_INT32 = 0x7fffffff;
const MIN_INT32 = ~MAX_INT32;

export class BinaryWriter {
  private bufs: Buffer[];
  private position_ptr = 0;
  private curr_buf_index = 0;

  private readonly grow_size = 8192; // 8 kb

  constructor() {
    this.bufs = [];
    this.bufs.push(Buffer.alloc(this.grow_size));
  }

  public get data() {
    return Buffer.concat(this.bufs).subarray(0, this.length);
  }

  public get length() {
    return this.curr_buf_index * this.grow_size + this.position_ptr - 1;
  }

  public get position() {
    return this.position_ptr;
  }

  public writeUInt8(val: number) {
    assert(
      val <= 255 || val >= 0,
      `Invalid UInt8 value: ${val}. Must be 0 <= val <= 255`,
    );
    const max_bytes_write_in_buf = this.calculateMaxBytesWriteInBuf(1);
    if (max_bytes_write_in_buf == 0) this.grow();

    this.bufs[this.curr_buf_index].writeUInt8(val, this.position_ptr);
    this.position_ptr += 1;
  }

  public writeUInt16BE(val: number) {
    assert(
      val <= 65535 || val >= 0,
      `Invalid UInt16 value: ${val}. Must be 0 <= val <= 65535`,
    );

    const max_bytes_write_in_buf = this.calculateMaxBytesWriteInBuf(2);

    if (max_bytes_write_in_buf == 2) {
      this.bufs[this.curr_buf_index].writeUInt16BE(val, this.position_ptr);
      this.position_ptr += 2;
    } else if (max_bytes_write_in_buf == 0) {
      this.grow();
      this.bufs[this.curr_buf_index].writeUInt16BE(val, this.position_ptr);
      this.position_ptr += 2;
    } else {
      this.bufs[this.curr_buf_index].writeUInt8(val >> 8, this.position_ptr);
      this.grow();
      this.bufs[this.curr_buf_index].writeUInt8(val & 8, this.position_ptr);
      this.position_ptr += 1;
    }
  }

  public writeUInt32BE(val: number) {
    assert(
      val <= 4_294_967_295 || val >= 0,
      `Invalid UInt32 value: ${val}. Must be 0 <= val <= 4_294_967_295`,
    );

    const max_bytes_write_in_buf = this.calculateMaxBytesWriteInBuf(4);

    if (max_bytes_write_in_buf == 4) {
      this.bufs[this.curr_buf_index].writeUInt32BE(val, this.position_ptr);
      this.position_ptr += 4;
    } else if (max_bytes_write_in_buf == 0) {
      this.grow();
      this.bufs[this.curr_buf_index].writeUInt32BE(val, this.position_ptr);
      this.position_ptr += 4;
    } else {
      const byte_size = 4 - max_bytes_write_in_buf;
      this.writeUnsignedNumberBE(
        val >> (8 * byte_size),
        max_bytes_write_in_buf,
      );
      this.grow();
      this.writeUnsignedNumberBE(
        val & (0xffffffff >>> (8 * max_bytes_write_in_buf)),
        byte_size,
      );
      this.position_ptr += byte_size;
    }
  }

  public writeInt8(val: number) {
    assert(
      val <= 127 || val >= -128,
      `Invalid Int8 value: ${val}. Must be -128 <= val <= 127`,
    );
    const max_bytes_write_in_buf = this.calculateMaxBytesWriteInBuf(1);
    if (max_bytes_write_in_buf == 0) this.grow();

    this.bufs[this.curr_buf_index].writeInt8(val, this.position_ptr);
    this.position_ptr += 1;
  }

  public writeInt16BE(val: number) {
    assert(
      val <= 32767 || val >= -32678,
      `Invalid Int16 value: ${val}. Must be -32678 <= val <= 32677`,
    );

    const max_bytes_write_in_buf = this.calculateMaxBytesWriteInBuf(2);

    if (max_bytes_write_in_buf == 2) {
      this.bufs[this.curr_buf_index].writeInt16BE(val, this.position_ptr);
      this.position_ptr += 2;
    } else if (max_bytes_write_in_buf == 0) {
      this.grow();
      this.bufs[this.curr_buf_index].writeInt16BE(val, this.position_ptr);
      this.position_ptr += 2;
    } else {
      this.bufs[this.curr_buf_index].writeInt8(val >> 8, this.position_ptr);
      this.grow();
      this.bufs[this.curr_buf_index].writeUInt8(val & 8, this.position_ptr);
      this.position_ptr += 1;
    }
  }

  public writeInt32BE(val: number) {
    assert(
      val <= MAX_INT32 || val >= MIN_INT32,
      `Invalid Int32 value: ${val}. Must be -2_147_483_648 <= val <= 2_147_483_647`,
    );

    const max_bytes_write_in_buf = this.calculateMaxBytesWriteInBuf(4);

    if (max_bytes_write_in_buf == 4) {
      this.bufs[this.curr_buf_index].writeInt32BE(val, this.position_ptr);
      this.position_ptr += 4;
    } else if (max_bytes_write_in_buf == 0) {
      this.grow();
      this.bufs[this.curr_buf_index].writeInt32BE(val, this.position_ptr);
      this.position_ptr += 4;
    } else {
      const byte_size = 4 - max_bytes_write_in_buf;

      this.writeSignedNumberBE(val >> (8 * byte_size), max_bytes_write_in_buf);
      this.grow();
      this.writeUnsignedNumberBE(
        val & (0xffffffff >>> (8 * max_bytes_write_in_buf)),
        byte_size,
      );
      this.position_ptr += byte_size;
    }
  }

  public writeBoolean(val: boolean) {
    this.writeUInt8(val ? 1 : 0);
  }

  public writeString(str: string) {
    const max_bytes_write_in_buf = this.calculateMaxBytesWriteInBuf(str.length);
    const sub_str = str.slice(0, max_bytes_write_in_buf);

    this.bufs[this.curr_buf_index].write(sub_str, this.position_ptr);
    this.position_ptr += max_bytes_write_in_buf;

    if (str.length != max_bytes_write_in_buf) {
      this.grow();
      this.writeString(str.slice(max_bytes_write_in_buf));
    }
  }

  private writeSignedNumberBE(val: number, byte_size: number) {
    switch (byte_size) {
      case 1:
        this.bufs[this.curr_buf_index].writeInt8(val, this.position_ptr);
        break;
      case 2:
        this.bufs[this.curr_buf_index].writeInt16BE(val, this.position_ptr);
        break;
      case 3:
        this.bufs[this.curr_buf_index].writeInt16BE(
          val >> 8,
          this.position_ptr,
        );
        this.bufs[this.curr_buf_index].writeInt8(val & 0xff, this.position_ptr);
        break;
      case 4:
        this.bufs[this.curr_buf_index].writeInt32BE(val, this.position_ptr);
        break;
    }
  }

  private writeUnsignedNumberBE(val: number, byte_size: number) {
    switch (byte_size) {
      case 1:
        this.bufs[this.curr_buf_index].writeUInt8(val, this.position_ptr);
        break;
      case 2:
        this.bufs[this.curr_buf_index].writeUInt16BE(val, this.position_ptr);
        break;
      case 3:
        this.bufs[this.curr_buf_index].writeUInt16BE(
          val >>> 8,
          this.position_ptr,
        );
        this.bufs[this.curr_buf_index].writeUInt8(
          val & 0xff,
          this.position_ptr,
        );
        break;
      case 4:
        this.bufs[this.curr_buf_index].writeUInt32BE(val, this.position_ptr);
        break;
    }
  }

  private calculateMaxBytesWriteInBuf(size: number) {
    return Math.min(8192 - this.position_ptr, size);
  }

  private grow() {
    this.bufs.push(Buffer.alloc(this.grow_size));
    ++this.curr_buf_index;
    this.position_ptr = 0;
  }
}
