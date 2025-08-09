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

  constructor(partial: Partial<ResultDto<T>>) {
    Object.assign(this, partial);
  }

  private static sanitizeData(data: any): any {
    if (!data) return data;

    const removeKeys = ['passwordHash', 'password', 'secretKey'];
    const stripFields = (obj: any) => {
      if (Array.isArray(obj)) {
        return obj.map(stripFields);
      }
      if (obj && typeof obj === 'object') {
        for (const key of removeKeys) {
          if (key in obj) delete obj[key];
        }
        for (const key in obj) {
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
}
