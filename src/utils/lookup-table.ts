export type LookUpdatype<EntityType> = { [key: string]: EntityType };

export function getLookUpTableFromArr<
  ProvidedEntity extends { idUnique: string | number }
>(arr: ProvidedEntity[]) {
  const lookUpTable: LookUpdatype<ProvidedEntity> = {};

  arr.forEach((item) => {
    lookUpTable[item.idUnique] = item;
  });

  return lookUpTable;
}
