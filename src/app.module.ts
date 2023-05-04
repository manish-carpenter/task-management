import { Module } from '@nestjs/common';
//import { AppController } from './app.controller';
//import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [
    TasksModule,
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: 'localhost',
      port: 1433,
      username: 'sa',
      password: 'Admin@123',
      database: 'task-management',
      //entities: [__dirname + '/../**/*.entity.js'],
      autoLoadEntities: true,
      synchronize: true,
      extra: {
        trustServerCertificate: true,
      },
    }),
    AuthModule,
  ],
  //controllers: [AppController],
  //providers: [AppService],
})
export class AppModule {}
