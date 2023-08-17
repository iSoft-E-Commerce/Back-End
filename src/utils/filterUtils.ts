import { Product } from 'src/product/entities/product.entity';

export const nameFilter = (products: Product[]) => {
  const uniqueName: { [key: string]: boolean } = {};
  const productsName: Product[] = [];
  for (const item of products) {
    if (!uniqueName[item.name]) {
      uniqueName[item.name] = true;
      productsName.push(item);
    }
  }
  return productsName;
};

export const colorFilter = (products: Product[]) => {
  const uniqueColors: { [key: string]: boolean } = {};
  const filterColors: Product[] = [];

  for (const item of products) {
    if (!uniqueColors[item.colorName]) {
      uniqueColors[item.colorName] = true;
      filterColors.push(item);
    }
  }

  return filterColors;
};

export const memoryFilter = (products: Product[]) => {
  const uniqueMemory: { [key: string]: boolean } = {};
  const productMemory: Product[] = [];
  for (const item of products) {
    if (item.memory !== '') {
      if (!uniqueMemory[item.memory]) {
        uniqueMemory[item.memory] = true;
        productMemory.push(item);
      }
    }
  }
  const sortMemory = productMemory.sort(
    (a, b) => parseInt(a.memory) - parseInt(b.memory),
  );
  return sortMemory;
};
