import { ApiProperty } from '@nestjs/swagger';
import { HttpException } from '@nestjs/common';

/**
 * Generic Result Data Transfer Object (DTO)
 * Used to standardize API responses across the application.
 * Supports both success and failure responses.
 */
export class ResultDto<T> {
  @ApiProperty({ example: true })
  success: boolean; // Indicates if the operation was successful or not

  @ApiProperty({ example: 200 })
  statusCode: number; // HTTP status code (e.g., 200, 400, 404, etc.)

  @ApiProperty({ example: 'Operation completed successfully', required: false })
  message?: string; // Optional success message

  @ApiProperty({ example: 'Some error occurred', required: false })
  reason?: string; // Optional error message explaining the failure

  @ApiProperty({ required: false })
  data?: T; // Generic response data (could be entity, array, etc.)

  @ApiProperty({ example: 'NOT_FOUND', required: false })
  errorType?: string; // Optional machine-readable error type identifier

  constructor(partial: Partial<ResultDto<T>>) {
    Object.assign(this, partial);
  }

  /**
   * Removes sensitive fields from the response object.
   * Prevents leaking credentials or secrets in API responses.
   *
   * @param data - Data object to sanitize
   * @returns Sanitized data object
   */
  private static sanitizeData<TData>(data: TData): TData {
    if (!data || typeof data !== 'object') return data;

    const removeKeys = ['passwordHash', 'password', 'secretKey'];
    const visited = new WeakSet();

    const stripFields = (obj: unknown): unknown => {
      if (obj === null || typeof obj !== 'object') return obj;

      if (visited.has(obj)) {
        return obj; // prevent infinite recursion
      }
      visited.add(obj);

      if (Array.isArray(obj)) {
        return obj.map(stripFields);
      }

      const result: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(
        obj as Record<string, unknown>,
      )) {
        if (!removeKeys.includes(key)) {
          result[key] = stripFields(value);
        }
      }

      return result;
    };

    return stripFields(data) as TData;
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
    const result = new ResultDto<T>({
      success: false,
      reason,
      statusCode,
      errorType,
    });

    if (process.env.NODE_ENV !== 'test') {
      throw new HttpException(result, statusCode);
    }

    return result;
  }

  static okEmpty(): ResultDto<void> {
    return new ResultDto<void>({
      success: true,
      statusCode: 200,
    });
  }
}
