/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DiagramsModule } from './diagrams/diagrams.module';
import { CollaborationModule } from './collaboration/collaboration.module';
import { ValidationModule } from './validation/validation.module';
import { ExportModule } from './export/export.module';
import { CatalogModule } from './catalog/catalog.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('DATABASE_CONNECTION_STRING'),
      }),
    }),
    DiagramsModule,
    CollaborationModule,
    ValidationModule,
    ExportModule,
    CatalogModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
