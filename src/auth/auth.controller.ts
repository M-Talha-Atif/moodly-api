import {
  Body,
  Controller,
  Post,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import type { Response } from 'express';

// AuthController handles user authentication operations such as sign-up, login, and logout.
// It uses the AuthService to perform the actual logic and returns appropriate responses.
// The signUp method creates a new user, the login method authenticates a user and sets a cookie,
// and the logout method clears the authentication cookie.
// Each method returns a JSON response with the result of the operation, including status codes.
// The controller is decorated with @Controller('auth') to define the base route for authentication-related
// endpoints. The methods are decorated with @Post to handle POST requests for sign-up, login, and logout.
// The @Res decorator is used to access the response object directly for setting cookies and
// returning JSON responses with appropriate status codes.
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Endpoint for user sign-up
  // Expects a POST request with user details in the body
  // Returns a JSON response with the result of the sign-up operation
  // The response status code is set based on the result of the operation
  // HttpCode decorator sets the response status code to 201 Created for successful sign-up
  // This is useful for RESTful APIs to indicate that a new resource has been created
  // The method expects a SignUpDto object in the request body, which contains user details
  // The response is sent using the @Res decorator to allow for custom status codes and JSON
  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto, @Res() res: Response) {
    const result = await this.authService.signUp(signUpDto);
    return res.status(result.statusCode).json(result);
  }

  // Endpoint for user login
  // Expects a POST request with login credentials in the body
  // Returns a JSON response with the result of the login operation
  // The response status code is set based on the result of the operation
  // If login is successful, a JWT token is set as a cookie in the response
  // The cookie is set with httpOnly, secure, sameSite, and maxAge options
  // This ensures the token is not accessible via JavaScript, is secure in production,
  // and has a defined expiration time of 24 hours
  // The method expects a LoginDto object in the request body, which contains user credentials
  // The @Res decorator is used to access the response object directly for setting cookies
  // and returning JSON responses with appropriate status codes
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.login(loginDto);

    if (result.success && result.data?.access_token) {
      response.cookie('jwt', result.data.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000,
      });
    }

    response.status(result.statusCode);
    return result;
  }

  // Endpoint for user logout
  // Expects a POST request to log out the user
  // Clears the JWT cookie from the response to log out the user
  // Returns a JSON response with the result of the logout operation
  // The response status code is set based on the result of the operation
  // The @Res decorator is used to access the response object directly for clearing cookies
  // and returning JSON responses with appropriate status codes
  // This method does not require any body parameters as it simply clears the cookie
  // and returns a success message
  // The response is sent using the @Res decorator to allow for custom status codes and JSON
  // The cookie is cleared by setting it with an empty value and a past expiration date
  // This effectively logs the user out by removing the authentication token from the client
  // The method returns a ResultDto object indicating the success of the logout operation
  // The ResultDto object contains a success flag, message, and status code
  // The status code is set to 200 OK for a successful logout operation
  // This is useful for RESTful APIs to indicate that the operation was successful
  // The method does not return any data as the logout operation is simply clearing the cookie
  // and returning a success message
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    const result = await this.authService.logout();
    response.clearCookie('jwt');
    return response.status(result.statusCode).json(result);
  }
}
