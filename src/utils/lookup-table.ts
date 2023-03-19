export type LookUpdatype<EntityType> = { [key: string]: EntityType };

export function getLookUpTableFromArr<
  ProvidedEntity extends { id: string | number }
>(arr: ProvidedEntity[]) {
  const lookUpTable: LookUpdatype<ProvidedEntity> = {};

  arr.forEach((item) => {
    lookUpTable[item.id] = item;
  });

  return lookUpTable;
}
