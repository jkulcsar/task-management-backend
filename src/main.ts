import { NestFactory } from '@nestjs/core'
import { Logger } from '@nestjs/common'
import { AppModule } from './app.module'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import * as config from 'config'

async function bootstrap() {
  const logger = new Logger('bootstrap')
  const app = await NestFactory.create(AppModule)

  const serverConfig = config.get('server')

  if (process.env.NODE_ENV === 'development') {
    app.enableCors()
  } else {
    app.enableCors({ origin: serverConfig.origin })
    logger.log(
      `Environment ${process.env.NODE_ENV} accepting requests from origin: ${serverConfig.origin}`,
      // docker run is showing:
      // Environment undefined accepting requests from origin: undefined
      // TODO: must set the RDS_* env variables for the docker run, NODE_ENV also!
    )
  }

  const swaggerOptions = new DocumentBuilder()
    .setTitle('Task Management')
    .setDescription('An all purpose, simple task management system')
    .setVersion('1.0')
    .addTag('tasks')
    .build()
  const document = SwaggerModule.createDocument(app, swaggerOptions)
  SwaggerModule.setup('api', app, document)
  const port = process.env.PORT || serverConfig.port
  await app.listen(port)

  logger.log(`Application listening on port ${port}`)
}
bootstrap()
