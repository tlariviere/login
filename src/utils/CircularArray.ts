/**
 * Array with specified maximum length.
 * When full, inserting new element will replace oldest element instead of growing buffer.
 */
export default class CircularArray<T> {
  private buffer_: T[] = [];
  private currentIndex_ = -1;
  private maxLength_: number;

  public constructor(maxLength: number) {
    if (maxLength <= 0) {
      throw new Error(
        "Invalid argument 'maxLength': expected stricly positive number"
      );
    }

    this.maxLength_ = maxLength;
  }

  /**
   * @returns Underlying buffer.
   */
  public values(): readonly T[] {
    return this.buffer_;
  }

  /**
   * Push element at current index position.
   * @param arg new element.
   * @returns replaced element if any.
   */
  public pushOrReplace(arg: T): T | undefined {
    let result;
    this.currentIndex_ += 1;
    if (this.currentIndex_ === this.maxLength_) {
      this.currentIndex_ = 0;
    }
    if (this.buffer_.length < this.maxLength_) {
      this.buffer_.push(arg);
    } else {
      result = this.buffer_[this.currentIndex_];
      this.buffer_[this.currentIndex_] = arg;
    }
    return result;
  }

  /**
   * @returns element at current index position if any.
   */
  public back(): T | undefined {
    if (this.buffer_.length > 0) {
      return this.buffer_[this.currentIndex_];
    }
    return undefined;
  }

  /**
   * Clear buffer and reset index.
   */
  public clear(): void {
    this.buffer_ = [];
    this.currentIndex_ = -1;
  }
}
