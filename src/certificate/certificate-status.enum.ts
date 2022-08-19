export enum CertificateStatus {
  /**
   * No owner
   */
  AVAILABLE = 'AVAILABLE',

  /**
   * Owner is present and certificate hasn't been transferred
   */
  OWNED = 'OWNED',

  /**
   * Owner is present and certificate has been transferred from one owner to another
   */
  TRANSFERRED = 'TRANSFERRED',
}
