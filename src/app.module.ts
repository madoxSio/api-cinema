import { Module } from '@nestjs/common';
//import { PrismaModule } from './prisma/prisma.module';
import { HelloModule } from './hello-test/hello.module';

@Module({
  imports: [
    //PrismaModule, // Gestion de la base de données avec Prisma
    HelloModule,  // Module Hello contenant le contrôleur et le service
  ],
})
export class AppModule {}
