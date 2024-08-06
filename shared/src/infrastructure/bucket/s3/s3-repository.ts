/* eslint-disable no-console */
import { S3 } from 'aws-sdk';

export abstract class S3Repository {
  constructor(private _client: S3) {}

  protected abstract bucketName: string;

  protected client(): S3 {
    return this._client;
  }

  protected async upload(image: string, key: string): Promise<string> {
    const base64Data = Buffer.from(image.replace(/^data:image\/\w+;base64,/, ''), 'base64');
    const type = image.split(';')[0].split('/')[1];
    await this._client
      .upload({
        Bucket: this.bucketName,
        Key: key,
        Body: base64Data,
        ContentEncoding: 'base64',
        ContentType: `image/${type}`
      })
      .promise();
    return key;
  }

  protected async getObject(key: string): Promise<string | undefined> {
    try {
      const file = await this._client.getObject({ Bucket: this.bucketName, Key: key }).promise();
      if (file.Body) {
        return `data:${file.ContentType};base64,${Buffer.from(file.Body as Buffer).toString('base64')}`;
      }
    } catch (err) {
      console.log('Error', err);
    }
  }
}
