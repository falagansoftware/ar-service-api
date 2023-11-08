import { instanceToPlain, plainToClassFromExist, plainToInstance } from 'class-transformer';

export class Serializer {
  static item<D>(plainObject: unknown, type, typeSafe = true): D {
    return plainToInstance(type, plainObject, { excludeExtraneousValues: typeSafe });
  }

  static itemWithMerge<D>(plainObject: unknown, type, mergeObject: unknown, typeSafe = true): D {
    const instance: D = plainToInstance(type, plainObject, { excludeExtraneousValues: typeSafe });
    console.log(instance);
    const object: any = instanceToPlain(instance, { excludeExtraneousValues: typeSafe });
    console.log(object);
    return plainToClassFromExist(object, mergeObject, { excludeExtraneousValues: false });
  }

  static collection<D>(plainObjects: unknown[], type, typeSafe = true): D[] {
    const result: D[] = plainObjects.map((plainObject) => this.item(plainObject, type, typeSafe));
    return result;
  }
}
