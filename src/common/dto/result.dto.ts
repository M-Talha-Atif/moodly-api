import { ApiProperty } from '@nestjs/swagger';

export class ResultDto<T> {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Operation completed successfully', required: false })
  message?: string;

  @ApiProperty({ example: 'Some error occurred', required: false })
  reason?: string;

  @ApiProperty({ required: false })
  data?: T;

  @ApiProperty({ example: 'NOT_FOUND', required: false })
  errorType?: string;

  /**
   * Constructor to initialize ResultDto, partial is used to allow flexible initialization
   * @param partial Partial object to initialize properties
   */

  constructor(partial: Partial<ResultDto<T>>) {
    Object.assign(this, partial);
  }
  /**
   * Sanitizes data by removing sensitive fields
   * @param data Data to sanitize
   * @returns Sanitized data
   */
  private static sanitizeData(data: any): any {
    if (!data) return data;

    const removeKeys = ['passwordHash', 'password', 'secretKey'];
    const visited = new WeakSet();

    const stripFields = (obj: any): any => {
      if (!obj || typeof obj !== 'object') return obj;

      if (visited.has(obj)) {
        return obj; // prevent infinite recursion
      }
      visited.add(obj);

      if (Array.isArray(obj)) {
        return obj.map(stripFields);
      }

      for (const key of removeKeys) {
        if (key in obj) delete obj[key];
      }

      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          obj[key] = stripFields(obj[key]);
        }
      }

      return obj;
    };

    return stripFields(data);
  }

  static ok<T>(data?: T, message?: string, statusCode = 200): ResultDto<T> {
    return new ResultDto<T>({
      success: true,
      message,
      data: this.sanitizeData(data),
      statusCode,
    });
  }

  static fail<T>(
    reason: string,
    statusCode = 400,
    errorType?: string,
  ): ResultDto<T> {
    return new ResultDto<T>({
      success: false,
      reason,
      statusCode,
      errorType,
    });
  }

  static okEmpty(): ResultDto<void> {
    return new ResultDto<void>({
      success: true,
      statusCode: 200,
    });
  }
}
