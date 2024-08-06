import convict from 'convict';

const powerConnectConfig = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'staging', 'test'],
    default: 'default',
    env: 'NODE_ENV'
  },
  s3: {
    accessKeyId: {
      doc: 'The S3 access Key Id',
      format: String,
      env: 'AWS_S3_ACCESS_KEY_ID',
      default: ''
    },
    secretAccessKey: {
      doc: 'The S3 secret access key',
      format: String,
      env: 'AWS_S3_SECRET_ACCESS_KEY',
      default: ''
    }
  },
  dynamodb: {
    region: {
      doc: 'The region of DynamoDB',
      format: String,
      env: 'AWS_DYNAMO_DB_REGION',
      default: ''
    },
    accessKeyId: {
      doc: 'The DynamoDB access Key Id',
      format: String,
      env: 'AWS_DYNAMO_DB_ACCESS_KEY_ID',
      default: ''
    },
    endpoint: {
      doc: 'The endpoint of DynamoDB',
      format: String,
      env: 'AWS_DYNAMO_DB_ENDPOINT',
      default: ''
    },
    secretAccessKey: {
      doc: 'The DynamoDB secret access key',
      format: String,
      env: 'AWS_DYNAMO_DB_SECRET_ACCESS_KEY',
      default: ''
    }
  },
  rabbitmq: {
    connectionSettings: {
      username: {
        doc: 'RabbitMQ username',
        format: String,
        env: 'RABBITMQ_USERNAME',
        default: 'guest'
      },
      password: {
        doc: 'RabbitMQ password',
        format: String,
        env: 'RABBITMQ_PASSWORD',
        default: 'guest'
      },
      vhost: {
        doc: 'RabbitMQ virtual host',
        format: String,
        env: 'RABBITMQ_VHOST',
        default: '/'
      },
      connection: {
        secure: {
          doc: 'RabbitMQ secure protocol',
          format: Boolean,
          env: 'RABBITMQ_SECURE',
          default: false
        },
        hostname: {
          doc: 'RabbitMQ hostname',
          format: String,
          env: 'RABBITMQ_HOSTNAME',
          default: 'rabbitmq-srv'
        },
        port: {
          doc: 'RabbitMQ amqp port',
          format: Number,
          env: 'RABBITMQ_PORT',
          default: 5672
        }
      }
    },
    exchangeSettings: {
      name: {
        doc: 'RabbitMQ exchange name',
        format: String,
        env: 'RABBITMQ_EXCHANGE_NAME',
        default: 'domain_events'
      }
    },
    maxRetries: {
      doc: 'Max number of retries for each message',
      format: Number,
      env: 'RABBITMQ_MAX_RETRIES',
      default: 3
    },
    retryTtl: {
      doc: 'Ttl for messages in the retry queue',
      format: Number,
      env: 'RABBITMQ_RETRY_TTL',
      default: 1000
    }
  },
  jwt: {
    encrypt: {
      doc: 'password encrypt',
      format: String,
      env: 'JWT_ENCRYPT',
      default: ''
    }
  }
});

powerConnectConfig.loadFile([__dirname + '/default.json', __dirname + '/' + powerConnectConfig.get('env') + '.json']);

export default powerConnectConfig;
