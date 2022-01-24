import { CanActivate, ExecutionContext } from '@nestjs/common';

export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    // If userId doesn't exist, return value will be null / undefined and return from this method will be false
    return request.session.userId;
  }
}
