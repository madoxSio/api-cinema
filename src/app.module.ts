import { Module } from '@nestjs/common';
//import { PrismaModule } from './prisma/prisma.module';
import { HelloModule } from './hello-test/hello.module';
import { CinemaModule } from './cinema/cinema.module';

@Module({
  imports: [
    //PrismaModule, // Gestion de la base de données avec Prisma
    HelloModule,
    CinemaModule,
  ],
})
export class AppModule {}
