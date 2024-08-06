import { Collection, MongoClient } from 'mongodb';
import { AggregateRoot } from '../../../domain/aggregate-root';
import { Criteria } from '../../../domain/criteria/criteria';
import { MongoCriteriaConverter } from './mongo-criteria-converter';
import { Filters, Nullable } from '../../../domain';

export abstract class MongoRepository<T extends AggregateRoot> {
  private criteriaConverter: MongoCriteriaConverter;

  constructor(private _client: Promise<MongoClient>) {
    this.criteriaConverter = new MongoCriteriaConverter();
  }

  protected abstract moduleName(): string;

  protected client(): Promise<MongoClient> {
    return this._client;
  }

  protected async collection(): Promise<Collection> {
    return (await this._client).db().collection(this.moduleName());
  }

  protected async searchAllByCriteria<D>(criteria: Criteria): Promise<D[]> {
    const query = this.criteriaConverter.convert(criteria);

    const collection = await this.collection();

    return await collection.find<D>(query.filter, {}).sort(query.sort).skip(query.skip).limit(query.limit).toArray();
  }

  protected async searchByCriteria<D>(filters: Filters): Promise<Nullable<D>> {
    const query = this.criteriaConverter.getFilters(filters);

    const collection = await this.collection();

    return await collection.find<D>(query, {}).next();
  }

  protected async persist(id: string, aggregateRoot: T): Promise<void> {
    const collection = await this.collection();

    const document = { ...aggregateRoot.toPrimitives(), _id: id, id: undefined };

    await collection.updateOne({ _id: id }, { $set: document }, { upsert: true });
  }
}
