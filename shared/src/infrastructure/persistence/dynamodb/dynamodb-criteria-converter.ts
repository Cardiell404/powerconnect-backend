import { Criteria } from '../../../domain/criteria/criteria';
import { Filter } from '../../../domain/criteria/filter';
import { Operator } from '../../../domain/criteria/filter-operator';
import { Filters } from '../../../domain/criteria/filters';

type AttributeNames = { [key: string]: string };

interface DynamoDBFilter {
  filter: string;
  values: { [key: string]: any };
}

interface DynamoDBQuery {
  filter: string | undefined;
  values: { [key: string]: any } | undefined;
  attributeNames: AttributeNames | undefined;
  limit: number | undefined;
}

interface TransformerFunction<T, K> {
  (value: T): K;
}

export class DynamoDBCriteriaConverter {
  private filterTransformers: Map<Operator, TransformerFunction<Filter, DynamoDBFilter>>;

  constructor() {
    this.filterTransformers = new Map<Operator, TransformerFunction<Filter, DynamoDBFilter>>([
      [Operator.EQUAL, this.equalFilter],
      [Operator.NOT_EQUAL, this.notEqualFilter],
      [Operator.GT, this.greaterThanFilter],
      [Operator.LT, this.lowerThanFilter],
      [Operator.CONTAINS, this.containsFilter],
      [Operator.NOT_CONTAINS, this.notContainsFilter]
    ]);
  }

  public convert(criteria: Criteria): DynamoDBQuery {
    return {
      filter: criteria.hasFilters() ? this.generateFilter(criteria.filters).filter : undefined,
      values: criteria.hasFilters() ? this.generateFilter(criteria.filters).values : undefined,
      attributeNames: criteria.hasFilters() ? this.getExpressionAttributeNames(criteria.filters) : undefined,
      limit: criteria.limit || undefined
    };
  }

  public getExpressionAttributeNames(filters: Filters): AttributeNames {
    return filters.filters.reduce<AttributeNames>((acc, filter) => {
      acc[`#${filter.field.value}`] = filter.field.value;
      return acc;
    }, {});
  }

  public getFilters(filters: Filters): DynamoDBFilter {
    return filters.filters.length > 0 ? this.generateFilter(filters) : { filter: '', values: {} };
  }

  protected generateFilter(filters: Filters): DynamoDBFilter {
    const expressions = filters.filters.map(filter => this.filterTransformers.get(filter.operator.value)!(filter));
    const filterExpression = expressions.map(e => e.filter).join(' AND ');
    const values = expressions.reduce((acc, e) => ({ ...acc, ...e.values }), {});
    return { filter: filterExpression, values };
  }

  private equalFilter(filter: Filter): DynamoDBFilter {
    return {
      filter: `#${filter.field.value} = :${filter.field.value}`,
      values: { [`:${filter.field.value}`]: filter.value.value }
    };
  }

  private notEqualFilter(filter: Filter): DynamoDBFilter {
    return {
      filter: `#${filter.field.value} <> :${filter.field.value}`,
      values: { [`:${filter.field.value}`]: filter.value.value }
    };
  }

  private greaterThanFilter(filter: Filter): DynamoDBFilter {
    return {
      filter: `#${filter.field.value} > :${filter.field.value}`,
      values: { [`:${filter.field.value}`]: filter.value.value }
    };
  }

  private lowerThanFilter(filter: Filter): DynamoDBFilter {
    return {
      filter: `#${filter.field.value} < :${filter.field.value}`,
      values: { [`:${filter.field.value}`]: filter.value.value }
    };
  }

  private containsFilter(filter: Filter): DynamoDBFilter {
    return {
      filter: `contains(${filter.field.value}, :${filter.field.value})`,
      values: { [`:${filter.field.value}`]: filter.value.value }
    };
  }

  private notContainsFilter(filter: Filter): DynamoDBFilter {
    return {
      filter: `NOT contains(${filter.field.value}, :${filter.field.value})`,
      values: { [`:${filter.field.value}`]: filter.value.value }
    };
  }
}
