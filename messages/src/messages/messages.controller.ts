import { Controller, Get, Post, Body, Param } from '@nestjs/common';

@Controller('messages')
export class MessagesController {
  @Get()
  listMessages() {
    return 'ListMessage';
  }

  @Post()
  createMessage(@Body() body: any) {
    console.log(body);

    return 'createMessage';
  }

  @Get(':id')
  getMessage(@Param('id') id: string) {
    console.log(id);

    return 'id';
  }
}
