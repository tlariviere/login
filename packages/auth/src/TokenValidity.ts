/**
 * Token validity helper class.
 */
export default class TokenValidity {
  public jti: string;
  private invalidated_ = false;

  /**
   * TokenValidity constructor.
   * @param jti Token id.
   */
  public constructor(jti: string) {
    this.jti = jti;
  }

  public isValid(): boolean {
    return !this.invalidated_;
  }

  public invalidate(): void {
    this.invalidated_ = true;
  }
}
