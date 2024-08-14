interface DynamoDBUpdate {
  updateExpression: string;
  values: { [key: string]: any };
  attributeNames: { [key: string]: string };
}

export class DynamoDBUpdateConverter {
  private getUpdateExpression(updateData: any, keyName: string): string {
    const updateExpressionParts: string[] = [];

    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined && keyName !== key) {
        const safeKeyName = key === 'hidden' ? '#hiddenAttr' : `#${key}`;
        const safeValueName = key === 'hidden' ? ':hiddenAttr' : `:${key}`;
        updateExpressionParts.push(`${safeKeyName} = ${safeValueName}`);
      }
    });
    return `SET ${updateExpressionParts.join(', ')}`;
  }

  private getExpressionAttributeNames(updateData: any, keyName: string): { [key: string]: string } {
    const attributeNames: { [key: string]: string } = {};

    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined && keyName !== key) {
        const safeKeyName = key === 'hidden' ? '#hiddenAttr' : `#${key}`;
        attributeNames[safeKeyName] = key;
      }
    });
    return attributeNames;
  }

  private getExpressionAttributeValues(updateData: any, keyName: string): { [key: string]: any } {
    const attributeValues: { [key: string]: any } = {};

    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined && keyName !== key) {
        const safeValueName = key === 'hidden' ? ':hiddenAttr' : `:${key}`;
        attributeValues[safeValueName] = updateData[key];
      }
    });
    return attributeValues;
  }

  public convert(updateData: any, keyName: string): DynamoDBUpdate {
    return {
      updateExpression: this.getUpdateExpression(updateData, keyName),
      values: this.getExpressionAttributeValues(updateData, keyName),
      attributeNames: this.getExpressionAttributeNames(updateData, keyName)
    };
  }
}
