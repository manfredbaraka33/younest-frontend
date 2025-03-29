
export const getProductsOrServices = async () => {
  const response = await fetch("http://13.60.222.132/api/fetch_all_pos/");
  const data = await response.json();
  console.log(data.products);
  return data.products;
};

export const getShops = async () => {
  const response = await fetch("http://13.60.222.132/api/shops/");
  const data = await response.json();
  console.log(data.results);
  return data.results;
};


export const getFosSale = async () => {
  const response = await fetch("http://13.60.222.132/api/forsale2/");
  const data = await response.json();
  console.log(data.products);
  return data.products;
};






