import { Injectable } from '@nestjs/common';

@Injectable()
export class HelloService {

  getHello(): string {
    return 'Hello World!';
  }

  welcomSetence(): string {
    return "Welcom to my API";
  }
}
