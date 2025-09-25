import { Injectable } from '@nestjs/common';
import { ResultDto } from 'src/common/dto/result.dto';
import { ERROR_CODE_MAP } from 'src/common/constants/error-code-map';

@Injectable()
export class BookingErrorHandler {
  handleCancelError(error: Error): ResultDto<any> {
    const message = error.message;

    const errorMap = {
      'Booking not found': {
        code: ERROR_CODE_MAP.NOT_FOUND,
        type: 'NOT_FOUND',
      },
      'Experience not found': {
        code: ERROR_CODE_MAP.EXPERIENCE_NOT_FOUND,
        type: 'EXPERIENCE_NOT_FOUND',
      },
      'You can only cancel your own bookings': {
        code: ERROR_CODE_MAP.NOT_OWNER,
        type: 'NOT_OWNER',
      },
      'Booking is already cancelled': {
        code: ERROR_CODE_MAP.ALREADY_CANCELLED,
        type: 'ALREADY_CANCELLED',
      },
      'Cannot cancel past experiences': {
        code: ERROR_CODE_MAP.EXPERIENCE_PAST,
        type: 'EXPERIENCE_PAST',
      },
      'Cancellations must be at least 24 hours before start': {
        code: ERROR_CODE_MAP.CANCELLATION_WINDOW_PASSED,
        type: 'CANCELLATION_WINDOW_PASSED',
      },
      'No spots to release': {
        code: ERROR_CODE_MAP.NO_SPOTS_TO_RELEASE,
        type: 'NO_SPOTS_TO_RELEASE',
      },
    };

    const errorInfo = errorMap[message];
    if (errorInfo) {
      return ResultDto.fail(message, errorInfo.code, errorInfo.type);
    }

    return ResultDto.fail(
      'Failed to cancel booking',
      ERROR_CODE_MAP.SERVER_ERROR,
      'SERVER_ERROR',
    );
  }
}
