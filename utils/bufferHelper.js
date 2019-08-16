class bufferHelper {
  constructor() {
    this.buffers = []
    this.size = 0
  }
  get length() {
    return this.size
  }
  clean () {
    this.buffers = []
    this.size = 0
    return this
  }
  concat (buffer) {
    this.buffers.push(buffer)
    this.size += buffer.length
    return this
  }
  toBuffer () {
    return Buffer.concat(this.buffers, this.size)
  }
  toString (encoding) {
      return this.toBuffer().toString(encoding)
  }
}

export default bufferHelper